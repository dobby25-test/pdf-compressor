import { useCallback, useEffect, useRef, useState } from "react";
import { compressDocument, compressImage, compressPDF, createZipBlob, preloadCompressionFor } from "../utils/compression";
import { getFileCategory } from "../utils/file";
import { getOutputExt } from "../utils/format";

function createItem(file) {
  const category = getFileCategory(file);
  return {
    id: Math.random().toString(36).slice(2),
    file,
    category,
    compressed: null,
    compressing: false,
    preview: category === "image" ? URL.createObjectURL(file) : null,
    status: "idle",
    progress: 0,
    error: null,
    cancelRequested: false,
    outputExt: null,
  };
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function useCompressionQueue(settings, addToast) {
  const [items, setItems] = useState([]);

  const queueRef = useRef([]);
  const processingRef = useRef(false);
  const itemsRef = useRef(items);
  const settingsRef = useRef(settings);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    return () => {
      // Release blob URLs to keep memory usage stable during long sessions.
      itemsRef.current.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, []);

  const runSingleCompression = useCallback(
    async (id) => {
      const current = itemsRef.current.find((i) => i.id === id);
      if (!current) return;

      let timer;
      setItems((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, status: "compressing", compressing: true, progress: Math.max(i.progress, 5), error: null }
            : i,
        ),
      );

      try {
        timer = window.setInterval(() => {
          setItems((prev) =>
            prev.map((i) => {
              if (i.id !== id || !i.compressing) return i;
              return { ...i, progress: Math.min(i.progress + 8, 92) };
            }),
          );
        }, 180);

        const activeItem = itemsRef.current.find((i) => i.id === id);
        if (!activeItem) return;

        const quality = settingsRef.current.quality;
        const outputFmt = settingsRef.current.imageFormat;

        let blob;
        if (activeItem.category === "image") blob = await compressImage(activeItem.file, quality, outputFmt);
        else if (activeItem.category === "pdf") blob = await compressPDF(activeItem.file, quality);
        else blob = await compressDocument(activeItem.file);

        let wasCanceled = false;

        setItems((prev) =>
          prev.map((i) => {
            if (i.id !== id) return i;

            if (i.cancelRequested) {
              wasCanceled = true;
              return {
                ...i,
                status: "canceled",
                compressing: false,
                cancelRequested: false,
                progress: 0,
              };
            }

            return {
              ...i,
              compressing: false,
              status: "done",
              compressed: blob,
              progress: 100,
              outputExt: getOutputExt(outputFmt, i.category, i.file.name),
            };
          }),
        );

        if (wasCanceled) addToast(`Canceled ${activeItem.file.name}`, "info");
        else addToast(`Compressed ${activeItem.file.name}`, "success");
      } catch {
        const failed = itemsRef.current.find((i) => i.id === id);
        setItems((prev) =>
          prev.map((i) =>
            i.id === id
              ? {
                  ...i,
                  status: "error",
                  compressing: false,
                  progress: 0,
                  error: "Compression failed. Please retry.",
                }
              : i,
          ),
        );

        if (failed) addToast(`Failed to compress ${failed.file.name}`, "error");
      } finally {
        if (timer) window.clearInterval(timer);
      }
    },
    [addToast],
  );

  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;

    const workerCount = Math.max(
      1,
      Math.min(3, typeof navigator !== "undefined" && navigator.hardwareConcurrency ? Math.floor(navigator.hardwareConcurrency / 2) : 2),
    );

    const worker = async () => {
      while (queueRef.current.length) {
        const id = queueRef.current.shift();
        if (!id) break;
        await runSingleCompression(id);
      }
    };

    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    processingRef.current = false;

    // Handle race where new items were queued while workers were finishing.
    if (queueRef.current.length) {
      processQueue();
    }
  }, [runSingleCompression]);

  const enqueueItems = useCallback(
    (ids) => {
      if (!ids.length) return;

      const idSet = new Set(ids);
      const queueAdditions = [];

      setItems((prev) =>
        prev.map((i) => {
          if (!idSet.has(i.id)) return i;
          if (i.status === "compressing" || i.status === "queued") return i;
          queueAdditions.push(i.id);
          return { ...i, status: "queued", progress: 0, error: null, cancelRequested: false };
        }),
      );

      if (queueAdditions.length) {
        queueRef.current = [...new Set([...queueRef.current, ...queueAdditions])];
        processQueue();
      }
    },
    [processQueue],
  );

  const addFiles = useCallback(
    (files) => {
      const valid = Array.from(files).filter((file) => getFileCategory(file));
      if (!valid.length) {
        addToast("No supported files selected.", "error");
        return;
      }

      const newItems = valid.map(createItem);

      setItems((prev) => [...prev, ...newItems]);
      addToast(`Added ${newItems.length} file${newItems.length > 1 ? "s" : ""}.`, "success");
    },
    [addToast],
  );

  const removeItem = useCallback((id) => {
    queueRef.current = queueRef.current.filter((qId) => qId !== id);
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const onItemAction = useCallback(
    (item) => {
      if (item.status === "compressing") {
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, cancelRequested: true } : i)));
        return;
      }

      if (item.status === "queued") {
        queueRef.current = queueRef.current.filter((qId) => qId !== item.id);
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "canceled", progress: 0, cancelRequested: false } : i)),
        );
        addToast(`Removed ${item.file.name} from queue.`, "info");
        return;
      }

      enqueueItems([item.id]);
    },
    [addToast, enqueueItems],
  );

  const compressAll = useCallback(() => {
    const eligibleIds = items.filter((i) => i.status !== "queued" && i.status !== "compressing").map((i) => i.id);

    if (!eligibleIds.length) {
      addToast("No files available to queue.", "info");
      return;
    }

    const hasPdf = items.some((i) => i.status !== "queued" && i.status !== "compressing" && i.category === "pdf");
    if (hasPdf) preloadCompressionFor("pdf");
    enqueueItems(eligibleIds);
    addToast(`Queued ${eligibleIds.length} file${eligibleIds.length > 1 ? "s" : ""}.`, "success");
  }, [addToast, enqueueItems, items]);

  const downloadOne = useCallback(
    (item) => {
      if (!item.compressed) return;
      const ext = item.outputExt || getOutputExt(settings.imageFormat, item.category, item.file.name);
      const name = item.file.name.replace(/\.[^.]+$/, "") + "_compressed." + ext;
      triggerDownload(item.compressed, name);
      addToast(`Downloaded ${name}`, "success");
    },
    [addToast, settings.imageFormat],
  );

  const downloadAll = useCallback(async () => {
    const done = items.filter((i) => i.compressed);
    if (!done.length) {
      addToast("No compressed files to download.", "info");
      return;
    }

    preloadCompressionFor("zip");
    const zipInputs = done.map((item) => {
      const ext = item.outputExt || getOutputExt(settings.imageFormat, item.category, item.file.name);
      const name = item.file.name.replace(/\.[^.]+$/, "") + "_compressed." + ext;
      return { name, blob: item.compressed };
    });

    const zipBlob = await createZipBlob(zipInputs);
    triggerDownload(zipBlob, "compressed_files.zip");
    addToast("Downloaded compressed_files.zip", "success");
  }, [addToast, items, settings.imageFormat]);

  const clearAll = useCallback(() => {
    queueRef.current = [];
    setItems((prev) => {
      prev.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
      return [];
    });
    addToast("Cleared all files.", "info");
  }, [addToast]);

  const queueCount = items.filter((i) => i.status === "queued").length;
  const activeCount = items.filter((i) => i.status === "compressing").length;
  const failedCount = items.filter((i) => i.status === "error").length;
  const compressedCount = items.filter((i) => i.compressed).length;

  return {
    items,
    addFiles,
    removeItem,
    onItemAction,
    compressAll,
    downloadOne,
    downloadAll,
    clearAll,
    queueCount,
    activeCount,
    failedCount,
    compressedCount,
  };
}

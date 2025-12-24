// 測試環境設置檔
import { beforeEach } from "vitest";

// 在每個測試前清理 DOM
beforeEach(() => {
  if (typeof document !== "undefined") {
    document.body.innerHTML = "";
  }
});

# AIBot Admin 迁移验证记录

日期：2026-10-06（Asia/Kuala_Lumpur）。

## 迁移结果

新项目根目录：`/Users/apple/Documents/ChatGPT/AIBot_Admin/`。
应用目录：`willbet-ai-admin/`。完整后台源码、QA 文件和说明已复制，交接摘要位于项目根目录。
复制阶段逐文件字节比较通过。迁移后仅新副本更新 `server.py`（支持 --port）、后台 README、Excel QA 来源、交接摘要，并新增根 README、本记录和迁移截图。原副本未修改、未删除。

## 实测

- 从新项目启动 `server.py --port 4181`，服务监听 `127.0.0.1:4181`；本次进程 PID 41848。
- 页面、app.js、seed.js、styles.css 均返回 HTTP 200。
- Excel 模板接口 `/api/template` 返回 200，五列表头正确。
- Excel `/api/parse` 从新目录的 QA 文件解析四行；损坏文件返回 400。
- 浏览器真实上传得到总量 4、有效 1、异常 3，缺 Context、类型/来源错误、空正文及重复内容均标记正确。取消预览，没有写入新的测试知识。
- 浏览器六模块导航正常，控制台无 error；截图见 `willbet-ai-admin/qa/migrated-overview.jpg`。
- JavaScript 语法检查与 `qa/check.cjs` 全部通过。
- 入口资源相对路径、QA 的 __dirname 路径、服务按 __file__ 定位静态目录均可在新项目独立使用。当前 origin 的 Excel API 不依赖旧项目。

## 移动端保护

移动端目录：`/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-client-demo/`。
迁移前后 index.html、app.js、ai-business.js、styles.css、README.md SHA-256 完全一致。移动端 Git 状态仍是既有三处改动（ai-business.js、app.js、styles.css），未新增本次改动。

## Git

新项目复用用户预先建立的独立 `.git`，分支 main，尚无提交。新文件均未跟踪，未暂存、提交或推送。git diff 与 git diff --cached 均为空（文件未跟踪，不代表没有文件）。

## 保留与清理

原目录 `/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-admin/` 和原 `CHAT_MIGRATION_HANDOFF.md` 均保留。
迁移验证已通过；后续先停止原 4180 服务，再可删除上述旧后台目录和旧交接摘要。移动端独立仓库、原业务资料及其 Git 数据不得当作后台冗余删除。

文件迁移不自动迁移浏览器 origin 的 localStorage。新 4181 使用默认 seed，旧 4180 的运营状态仍留在原浏览器存储中。

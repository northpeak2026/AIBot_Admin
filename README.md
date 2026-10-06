# AIBot Admin

独立后台项目根目录：`/Users/apple/Documents/ChatGPT/AIBot_Admin/`。
后台应用与 QA 文件在 `willbet-ai-admin/`，不包含移动端代码。

## 启动

```sh
cd /Users/apple/Documents/ChatGPT/AIBot_Admin
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 willbet-ai-admin/server.py --port 4181
```

访问：<http://127.0.0.1:4181/>。
Python 需要 openpyxl；其他机器可使用已安装 openpyxl 的 Python 3。

## 检查

```sh
cd /Users/apple/Documents/ChatGPT/AIBot_Admin
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check willbet-ai-admin/app.js
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node willbet-ai-admin/qa/check.cjs
```

详细说明见 `willbet-ai-admin/README.md`，聊天上下文见 `CHAT_MIGRATION_HANDOFF.md`。
旧项目文件仍然保留，没有自动删除。浏览器旧 origin 的 localStorage 不随文件复制迁移。

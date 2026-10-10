# AIBot Admin

## 修改后的预览要求

每次修改完成后，最终回复都必须提供可点击的本地预览链接，并先确认本地服务可用。默认地址：http://127.0.0.1:4181/ 。GitHub Pages 链接不能替代本地预览链接。具体协作要求见 `AGENTS.md`。

## GitHub Pages 发布

发布配置：`.github/workflows/pages.yml`。启用仓库 Pages 并选择 GitHub Actions 后，推送 main 自动发布。仅发布后台 HTML、CSS、JavaScript，不发布交接文档、QA 文件和 Python 服务。

线上访问地址：https://northpeak2026.github.io/AIBot_Admin/ 。仓库已公开，GitHub Pages 使用 GitHub Actions 自动发布。

Pages 为静态托管，五模块页面及浏览器本地保存可以使用；Excel 模板下载和上传解析依赖 Python API，需使用本地服务。不同访问者的数据独立保存在各自浏览器中。

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

## 2026-10-10 一期调整

Intent 区分知识回复与业务能力，回复形式支持多选；最新关联规则为一个 Intent 最多关联一条 Knowledge，Knowledge 可供多个 Intent 使用。历史多条关联保留，无主回复知识时标记待配置。知识库简化为名称及回复正文，Excel 为两列模板。问题中心菜单移除，巡检通过会话关注与备注完成；概览统计会话信号，基础配置补齐助手信息及业务能力兜底。

原有 90 段会话、知识原始数据和历史问题记录均保留；新 seed 另补充 5 段业务能力 / 巡检场景，旧浏览器数据不会被 seed 覆盖。详细兼容规则和验收说明见 `willbet-ai-admin/README.md`。

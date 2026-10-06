# AIBot AI 助手运营后台一期

从新项目根目录运行：

```sh
cd /Users/apple/Documents/ChatGPT/AIBot_Admin
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 willbet-ai-admin/server.py --port 4181
```

预览：http://127.0.0.1:4181

原生 HTML / CSS / JavaScript；Python 本地服务提供真实 Excel 模板生成及 `.xlsx` 解析（依赖 openpyxl）。运营修改保存在浏览器 localStorage，不接生产接口。首次加载提供 150 个 Intent、30 条 Knowledge、90 段会话、68 条问题。

业务场景来源：项目 `WillBet AI Intent Tree V1 - Product.xmind`。将上游层级归并为业务模块、场景分类、Intent 三级；仅包含需求规定的六个默认业务目录。知识正文与会话为原型数据，不表示已确认的平台正式规则。

实体 ID 保存时自动生成且不可修改；删除不回收 ID。知识与 Intent 多对多关联由 Intent 页面维护，知识页只读关联。会话保存实际使用知识 ID；删除无关联知识后保留历史快照。问题按具体问答对去重，多个标签不增加问题记录数；新增或关联知识不会自动解决问题。

导入：进入业务目录 → 下载 Excel 模板 → 上传 → 校验预览 → 全部确认或仅导入有效行。校验名称、类型、来源、正文、混合型 Context 和内容重复，知识型 Context 自动置为“无需”。

`seed.js` 是初始数据，`app.js` 包含页面、筛选及操作，`styles.css` 包含布局，`server.py` 提供本地服务。默认数据保存在 `willbet-admin-v1` 浏览器存储键；清除该键后重新加载可恢复初始状态。

会话详情仅在已识别 Intent 时展示关联信息；反馈采用拇指图标，问题标记入口在鼠标悬停或键盘聚焦时出现。Intent 编辑仅展示已关联知识，添加通过独立选择弹窗完成，点击遮罩关闭当前弹窗。业务目录入口统一保留在基础配置。

新后台项目根目录为 `/Users/apple/Documents/ChatGPT/AIBot_Admin/`；应用目录为 `willbet-ai-admin/`。默认端口仍为 4180，迁移验证使用 `--port 4181`，避免与保留的旧服务冲突。静态资源均使用应用内相对路径；Excel 接口使用当前 origin 的 `/api/template` 和 `/api/parse`。

原始 Intent Tree 资料仍在 `/Users/apple/Documents/ChatGPT/AIBot/`，仅为业务背景来源，不是运行依赖。移动端独立仓库未被迁移或修改。完整交接见项目根目录 `CHAT_MIGRATION_HANDOFF.md`。换端口会使用新的浏览器存储空间，不自动迁移旧 origin 的运营修改。

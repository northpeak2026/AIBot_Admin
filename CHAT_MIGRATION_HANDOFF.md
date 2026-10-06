# 聊天迁移交接摘要

核对时间：2026-10-06，Asia/Kuala_Lumpur。以下以最新需求和当前代码为准，可直接作为新 Codex 聊天的起始上下文。

## 最新迁移状态（优先于下方历史状态）

- 后台已完整复制到独立项目 `/Users/apple/Documents/ChatGPT/AIBot_Admin/`，应用在其 `willbet-ai-admin/` 子目录；交接摘要在新项目根目录。
- 原 `/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-admin/` 和原交接文件仍保留，未删除。后续后台工作只修改新项目。
- 移动端是独立 Git 仓库 `/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-client-demo/`，本次迁移禁止修改，未复制到后台项目。
- 新项目已有独立 `.git`，分支 main、尚无提交；后台、README、交接文件为未跟踪。本次未暂存、提交或推送。
- 更正历史 Git 描述：外层 AIBot 仓库无提交，不代表移动端无 Git 历史。移动端最新提交为 `140d009`，已有 `ai-business.js`、`app.js`、`styles.css` 三处未提交改动（14 行新增、15 行删除），均早于本聊天且不得丢弃。
- 迁移实测已通过：页面与静态资源 HTTP 200、六模块导航、真实 Excel 上传校验、模板和解析接口、JS 回归，移动端文件哈希及 Git 状态未变；详见根目录 `MIGRATION_VERIFICATION.md`。
- 新服务使用 `http://127.0.0.1:4181/`，启动命令见新项目 README；原服务仍使用 4180。`server.py` 支持 `--port`，默认仍为 4180。
- 新副本的 Excel QA 文件已把知识来源更新为“AIBot 固定规则”。下方关于该测试文件旧品牌的提醒仅适用于旧副本。
- 资源相对路径与当前 origin 下的 Excel API 不依赖原项目目录。Intent Tree 原始资料仍留在原目录，仅是背景来源。
- 文件复制不迁移浏览器 localStorage；新端口使用默认 seed。旧端口的运营修改仍在原浏览器 origin 内，勿擅自清除。
- 下文保留原会话业务需求、执行与历史验证信息，其中旧目录、旧 PID、旧端口及原 Git 描述应以本节和当前实测为准。

## 1. 项目目标与工作范围

基于原项目中的 WillBet AI 助手一期背景、Intent Tree 与客户端原型，新增了一套面向产品和运营的 **AIBot AI 助手运营后台一期 HTML 交互原型**。

运营闭环：配置 AI 能理解什么 → 配置 AI 知道什么 → 查看用户如何使用 AI → 发现异常回答 → 补充和修正。

要求直接完成页面、丰富的原型数据、交互、跨模块跳转，并启动本地预览。不是静态说明文档，也不是模型训练或 AI 工程平台。后台站点当前品牌统一为 **AIBot**，历史项目资料及原客户端的文件名仍保留 WillBet。

原工作目录：`/Users/apple/Documents/ChatGPT/AIBot`。
实际新增后台目录：`/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-admin`。
原客户端目录：`/Users/apple/Documents/ChatGPT/AIBot/willbet-ai-client-demo`，本次没有修改。

原始完整需求由附件提供：`/Users/apple/.codex/attachments/6a94617b-0c19-4bf8-add6-f1d8636adfac/已粘贴的文本.txt`。跨项目迁移时此附件路径未必可用，后续以本摘要及源码为主要依据。

## 2. 已确认的业务需求

### 总体设计与边界

- 六个一级模块：概览、Intent 管理、知识库、会话记录、问题中心、基础配置。
- 中文 PC Web 后台；左侧导航、顶部 Header、卡片和表格、Drawer/Modal；列表分页、紧凑筛选、状态 Tag、ID 弱强调等宽样式、明显的实体跳转。
- 页面中不展示“Mock 数据”“示例数据”等解释性文案。
- 不做模型管理、训练、Prompt 工程、Confidence、Retrieval Score、Token/模型成本、API/Tool 技术配置、A/B Test、审批流、知识版本管理、复杂权限、问题处理人或领取指派机制。
- 所有后台用户默认可以操作；数据保留创建人、创建时间、最后修改人、更新时间等系统信息。

### 统一业务目录与场景分类

- 默认业务目录：Sports、Casino、Wallet、Promotion、VIP、Global。目录可新增、改名、排序、启停、删除，不能永久写死。
- 目录统一用于 Intent、知识库、会话/问题筛选和概览统计。
- 目录下存在 Intent、场景分类或 Knowledge 时禁止删除。
- Intent 层级：业务模块 → 场景分类 → Intent。分类可新增、改名、排序、删除；已有 Intent 时禁止删除。
- **最新入口位置：业务目录管理仅保留在基础配置，Intent 和知识库页不再显示入口。** Intent 页仍保留场景分类管理。

### 概览

- 时间：今日、昨日、近 7 日、近 30 日、自定义时间；可按业务目录筛选。
- 指标：会话数、咨询用户数、用户提问数、待处理问题、用户点踩数、知识未命中数、重复提问数、转人工客服数。
- 待处理问题只统计“待处理”和“处理中”的唯一问题记录，多标签不重复计数。
- 趋势可切换会话数、用户提问数、问题数、用户点踩、转人工。
- 热门咨询按 Intent 咨询次数排序；支持跳 Intent 详情/对应会话。
- 知识未命中、点踩、重复提问 TOP 可跳问题中心并带类型、Intent、时间、业务目录等筛选条件。

### Intent 管理

- ID 如 `INT-000128`，保存时系统生成，全局唯一、不可编辑，不随名称或业务模块改变，也不回收已删除 ID。
- 编辑字段：业务名称、所属模块/分类、说明、多条典型问法、关联知识、启停状态。
- Intent 与 Knowledge 多对多；按 Knowledge ID + 名称搜索、多选绑定、解除关联；关联维护以 Intent 为主入口。
- 停用保留历史会话与知识关联，并可重新启用。
- 仅在没有历史会话且没有关联知识时允许删除；删除、停用二次确认。
- **最新编辑体验：默认只列已关联知识，每条可跳详情或解除关联；通过“＋ 添加 Knowledge”打开独立搜索多选弹窗。确认添加仅进入编辑草稿，点击“保存 Intent”才持久化。取消添加保留原编辑表单。**

### 知识库与 Excel

- Knowledge ID 如 `KNO-000128`，系统生成、唯一、只读。
- 字段：知识名称、业务目录、类型、回答所需业务事实/Context、知识来源、正式知识长正文。
- 类型只有知识型/混合型：知识型 Context 自动为“无需”且不可编辑；混合型必须填写业务语言描述的实时事实。不配置技术接口、Schema、参数或 Tool。
- 当前品牌替换后的来源选项：AIBot 固定规则、后台配置、供应商规则、混合来源。
- 知识详情只读显示关联 Intent（ID + 名称），可跳 Intent。
- 已关联 Intent 的知识不能删除，显示使用数量；未关联时二次确认可删。实现额外保留已删除知识的历史快照供会话回溯，不提供知识版本管理界面。
- Excel 流程：先选业务目录 → 下载模板 → 上传 `.xlsx` → 解析/校验 → 预览 → 确认全部导入或仅导入有效行；支持取消、重新上传。
- 模板只有五列：知识名称、类型、回答所需业务事实 / Context、知识来源、正式知识；不含 ID、目录、系统字段和 Intent 关联。
- 预览显示总量、有效、异常、无法导入数量及逐行异常。校验名称、类型、来源、正文、混合型 Context、重复内容。确认后直接生效并生成 ID，不走审批。

### 会话记录与消息展示

- 列表：会话 ID、UID/昵称或游客、开始/最后消息时间、消息数、命中模块/Intent、问题标记、会话状态。
- 筛选：时间、用户、模块、Intent、点踩/知识未命中/重复提问/转人工/是否存在问题。
- 详情：完整聊天时间线；显示 AI 实际使用的全部 Knowledge，支持实体跳转；历史使用知识不随当前 Intent 解绑而变化。
- **最新规则：只有该条用户消息已被识别出 Intent 时才展示 Intent ID + 名称；识别准确与否不影响展示，未识别不显示 Intent 信息。**
- **会话消息中的知识未命中、重复提问、人工标记等异常标签已隐藏；点赞/点踩用对应 AI 回答附近的 👍🏻 / 👎🏻 图标展示，不用 Tag。**
- **“标记为问题”默认隐藏，鼠标悬停某条消息时出现；键盘聚焦也可显示以便操作。**
- 这次标签隐藏针对会话消息呈现；列表筛选、列表问题标记和问题中心标签仍保留。

### 问题中心

- 最小单位是具体用户问题 + AI 回答，关联会话；一个会话可有多个问题，一组问答可有多个标签但只保留一个问题记录。
- ID 如 `PRB-000128`；来源为系统发现、用户反馈、运营人工标记。
- 类型：知识未命中、用户点踩、重复提问、转人工客服、人工标记。
- 知识未命中只指已识别的、应由知识库回答的业务问题缺少有效知识；闲聊、非平台问题、乱码、不支持的问题、已有知识但回答错误/知识错误不属于此类。
- 重复提问显示次数与相关消息链；转人工区分 AI 引导/用户主动要求。
- 状态固定：待处理、处理中、已解决、无需处理；运营手动确认解决，无处理人/指派/领取。
- 详情展示问题、AI 回答、前后上下文、会话、模块、Intent、实际 Knowledge、标签、状态，可跳关联实体。
- 从问题新增知识自动带模块；有匹配 Intent 时新知识自动绑定；问题进入处理中，不自动解决。未识别 Intent 的人工问题仍能新增知识，但不会强行绑定不存在的 Intent。
- 关联已有知识加入当前 Intent，问题不会自动关闭；也可查看 Intent、标记已解决、无需处理。

### 基础配置的最终范围

- 保留欢迎语。
- 推荐问题：新增、编辑、删除、排序、启停。
- 可编辑兜底回复：非业务问题、知识未命中、需要登录。
- 保留转人工按钮文案、AI 转人工引导语。
- 保留业务目录管理入口。
- **不再提供 AI 名称、AI 头像字符/图片地址、上传 AI 头像、客服入口四项配置。** 旧数据字段可能仍在存储中，但不再呈现维护控件。

### 统一弹窗关闭与品牌

- 所有类似 Drawer/Modal 均支持点击灰色遮罩关闭；点击弹窗内部不关闭。
- 嵌套知识添加弹窗的遮罩仅关闭该层，不关闭底层 Intent 编辑；Escape 同样优先关闭添加层。
- 后台所有可见 WillBet 品牌文案改为 AIBot，包括标题、Logo、侧栏、会话助手名、知识来源、欢迎语/兜底文案等。
- 读取旧 localStorage 时递归替换旧品牌字符串，避免已保存数据继续呈现 WillBet。

## 3. 已执行的实现与涉及文件

新增目录 `willbet-ai-admin/`，原生 HTML/CSS/JavaScript，无前端构建步骤；Python 标准 HTTP 服务 + openpyxl 负责 Excel。

| 文件（相对原工作目录） | 用途 |
| --- | --- |
| `willbet-ai-admin/index.html` | 中文页面入口与 AIBot 标题 |
| `willbet-ai-admin/styles.css` | SaaS 后台布局、卡片/表格、弹窗、知识选择器、消息反馈及 hover 样式 |
| `willbet-ai-admin/app.js` | 六模块渲染、Hash 路由、筛选/分页、CRUD、目录/分类、关联草稿、消息/问题处理、导入、配置及存储迁移 |
| `willbet-ai-admin/seed.js` | 初始业务目录、分类、150 个 Intent、30 条 Knowledge、90 段会话、68 条多标签问题、配置 |
| `willbet-ai-admin/server.py` | 本地静态服务；`GET /api/template` 下载 Excel，`POST /api/parse` 接收原始 xlsx 字节并解析 |
| `willbet-ai-admin/README.md` | 启动、架构、数据来源与当前交互说明 |
| `willbet-ai-admin/qa/check.cjs` | Node VM 回归检查，无浏览器依赖 |
| `willbet-ai-admin/qa/import-validation.xlsx` | 初次 Excel 流程测试文件，含有效与多类无效行 |
| `willbet-ai-admin/qa/intent-updated.jpg` | 最新 Intent 编辑截图 |
| `willbet-ai-admin/qa/session-updated.jpg` | 最新会话展示截图 |
| `willbet-ai-admin/qa/overview.jpg` | 初次版本概览截图，早于品牌和后续需求变更，仅作历史参考 |

Intent 数据主要来自 `WillBet AI Intent Tree V1 - Product.xmind`，上游多层结构整理为三级。也读取了 OPML、产品化脚本、原客户端及其业务回复。知识正文/会话是原型内容，不代表审核通过的正式业务规则。

原目录还有下列背景文件，未修改：
- `WillBet AI Intent Tree V1 - Complete.xmind`
- `WillBet AI Intent Tree V1 - Product.xmind`
- `WillBet AI Intent Tree V1.xmind`
- `WillBet AI Intent Tree V1.opml`
- `build_willbet_opml.js`
- `productize_willbet_xmind.js`
- `willbet-ai-client-demo/`（`index.html`、`styles.css`、`app.js`、`ai-business.js`、`README.md` 等）

## 4. 当前运行与实现状态

- 用户初始要求及后续五项调整均已实现；未对外部署，没有生产接口、数据库或真实账户数据。
- 本地预览：`http://127.0.0.1:4180/`。本次交接核对时端口仍在监听，Python PID 为 `39725`；该 PID/会话不保证在新环境继续存在。
- 当前浏览器预览最近停在 Intent 管理的编辑 Drawer。
- 业务修改保存在当前浏览器 origin 的 localStorage 键 **`willbet-admin-v1`**。为保留已有操作，品牌变更没有改存储键。
- `seed.js` 仅在没有已存数据库时初始化；改 seed 不会覆盖现有 localStorage。品牌替换在读取时作用于内存，后续业务保存会持久化。
- 浏览器 QA 曾导入有效知识 `KNO-000031 · 赛事延期结算说明`、新增目录“运营服务”，并调整过 `INT-000001` 的修改时间。关联测试后恢复为原来两条关联。这些属于该浏览器本地状态，不在默认 seed 中；清除存储或换 origin 后初始数据不同。
- 实体 ID 通过 `db.counters` 自增。Knowledge 关联由 `intent.knowledge` 数组维护；历史消息保留自己的 `knowledge` ID 数组；删除知识存入 `archivedKnowledge`。
- 问题用 `session + message` 查找并去重；消息字段 `intent`/`intentRecognized` 决定展示识别结果，`feedback: 'up' | 'down'` 表示用户反馈。旧点踩标签会映射为 down。新 seed 中包含点赞和未识别 Intent 的消息场景。
- 弹窗统一由 `drawer()` 生成；`intentKnowledgeDraft` 存关联草稿；添加层使用 `.knowledge-picker`；消息组件 `messageHTML()` 也被问题详情复用。

## 5. 已完成的验证

- JavaScript `node --check` 通过。
- `qa/check.cjs` 最新一次在交接前重跑通过：ID 唯一、实体引用、导入校验、待处理去重、多条件筛选、自定义趋势日期、六模块渲染、未识别隐藏 Intent、反馈图标、无消息标签、仅已关联知识、配置/入口移除、旧品牌迁移。
- 浏览器验证过 Intent 添加/保存/解绑、问题回溯、概览带条件跳转、业务目录筛选、新增目录、基础配置。
- 真实下载 Excel 模板并上传 `.xlsx`：4 行中 1 行有效；正确识别缺 Context、错误类型、错误来源、空正文、重复内容；“仅导入有效数据”成功生效。
- 最新浏览器验证：点击灰色背景关闭主编辑；嵌套弹窗关闭保留底层表单；搜索/确认添加进入已关联列表；解除关联与保存正常。
- 直接读取计算样式验证标记按钮非悬停 opacity=0，悬停后 opacity=1；会话消息 `.tag` 数量为 0。
- 最新浏览器控制台未发现 error；最新截图在 `qa/intent-updated.jpg`、`qa/session-updated.jpg`。

## 6. 未完成事项与实际注意点

- **没有尚未落实的用户明确要求，也没有等待用户批准的事项。** 下一轮根据用户的新指令继续改现有后台，不要重建。
- 原型不具备服务端业务持久化；跨设备、跨 origin、换浏览器的数据不会自动迁移。若需要保留运营操作，需迁移 localStorage 中的数据库，而不仅是复制 seed。
- `qa/import-validation.xlsx` 创建于品牌更名前，部分来源仍为“WillBet 固定规则”。当前校验已改为“AIBot 固定规则”，重新使用该文件前应更新来源；最新版本未再次执行整段 Excel 浏览器上传，但通用导入回归仍通过。
- `qa/overview.jpg` 是旧版本图，不能当作最新页面证据。
- 初始数据与部分上游 Intent 名称是原型级内容；旧 localStorage 不自动同步后续 seed 中的命名润色及新增点赞/未识别场景，不应为展示新 seed 擅自清除用户状态。
- 自动审计通过 `audit()` 在大部分实体操作中维护；推荐问题排序、启停、删除目前仅保存数据库，未逐项补齐审计更新。若后续继续完善系统字段，应核对这些分支及初始种子元数据。
- 点击遮罩会放弃当前未保存编辑，这是此次明确要求的关闭逻辑，不要自行加确认弹窗或改成不可关闭。
- 最近一次调整中，识别不到 Intent 的消息被排除出概览 Intent 热门咨询，避免空引用导致概览报错；不要撤回这个保护。

## 7. Git 状态

交接时已实际核对：

- 当前分支：`main`。
- 仓库 **尚无任何提交**，`git log -1` 返回 main 没有 commits。
- 全部现有项目内容均为未跟踪 `??`：四个 XMind/OPML 文件、两个生成脚本、`willbet-ai-client-demo/`、新增 `willbet-ai-admin/`。
- 本次没有创建分支、暂存、提交、推送或 PR。此交接新生成的 `CHAT_MIGRATION_HANDOFF.md` 同样尚未跟踪。
- 不要将未跟踪的原始资料/客户端误认为可删除的临时产物。迁移必须复制实际文件，不能依赖 Git 提交历史恢复。

## 8. 后续执行指引

1. 在新项目里找到/复制完整 `willbet-ai-admin/`；如果继续依赖原始业务上下文，也一并带上原 Intent Tree 和客户端资料。迁移后的实际路径以新环境为准。
2. 先读 `README.md`、`app.js`、`styles.css`，基于现有实现继续，保留上述最新规则和用户本地状态。
3. 本机默认 `node` 不在 PATH；执行时使用已发现的运行时，或在新环境重新发现可用依赖。原机器路径：
   - Node：`/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`
   - Python：`/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`
   - Python 服务需要 `openpyxl`。不要仅运行普通静态 HTTP 服务，否则真实 Excel 功能缺失。
4. 本地启动（新目录自行替换）：

```sh
cd /Users/apple/Documents/ChatGPT/AIBot_Admin
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 willbet-ai-admin/server.py --port 4181
```

5. 回归检查（在后台目录）：

```sh
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --check app.js
/Users/apple/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node qa/check.cjs
```

6. 原环境沙箱首次禁止监听本地端口；已通过工具的权限升级启动 loopback 预览。新环境如有同样限制，应按正常审批机制申请启动/访问本地服务；不要把端口权限问题误判为代码问题。
7. 本次使用 Sites 技能的本地开发流程，未注册/发布站点；当前诉求是本地原型，后续未经新要求不需要外部发布。
8. 后续继续使用中文运营文案，不扩展技术参数、复杂审批/权限平台。保留原客户端，除非用户明确要求修改。

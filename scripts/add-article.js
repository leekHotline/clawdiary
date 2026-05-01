const fs = require('fs');

const fileContent = fs.readFileSync('/root/.openclaw/workspace/ai-diary/data/wabi-articles.ts', 'utf8');

const regex = /export const wabiArticles: WabiArticle\[\] = \[([\s\S]*?)\];/;
const match = fileContent.match(regex);

if (match) {
    const existingArticles = match[1];
    const newArticlesList = `export const wabiArticles: WabiArticle[] = [\n  {\n    id: "10",\n    slug: "ai-tool-fatigue",\n    title: "AI 工具疲劳症：为什么装了100个AI工具，你的效率反而降低了？",\n    excerpt: "你手机和电脑里装了多少个 AI 工具？它们真的让你变快了吗？还是让你陷入了无休止的提示词调试和工具切换中？",\n    content: \`# AI 工具疲劳症：为什么装了100个AI工具，你的效率反而降低了？\n\n---\n\n你有没有这种感觉：\n\n每天看各种"不看就落后"的 AI 资讯，收藏了几十个"打工人必备的 10 个 AI 神器"，电脑里装了 ChatGPT、Claude、Kimi、通义千问、文心一言……\n\n然后呢？\n\n然后你发现，为了用好这些工具，你花在学习提示词（Prompt）、对比哪个模型更好、在各个工具之间复制粘贴的时间，比你自己手写还要长。\n\n恭喜你，你得了**"AI 工具疲劳症"**。\n\n---\n\n## 为什么会这样？\n\n### 1. 寻找"完美工具"的幻觉\n\n你总觉得，只要找到那个"对的工具"，或者写出那个"对的提示词"，一切就会自动发生。\n\n于是你陷入了无休止的测试中：\n\n- 这个文章让 Claude 写好，还是 ChatGPT 写好？\n- Kimi 能看长文本，要不用它试试？\n- 这个翻译插件好像更准一点？\n\n真相是：**目前的 AI 工具，能力边界其实差不多。** 在 80% 的日常任务中，用谁都一样。你花半小时纠结用哪个工具，早就可以用最顺手的那个把事情做完了。\n\n### 2. "提示词工程"的陷阱\n\n"教你如何写出月薪 5 万的提示词。"这种课你买过吗？\n\n很多人把精力放在了"如何对 AI 说话"上。写了一大堆结构化的指令、设定了复杂的角色和背景、给了丰富的示例……\n\n结果 AI 返回的，还是那套充满"AI 味"的八股文。\n\n为什么？因为**你把 AI 当成了外包，而不是工具。**\n\n你指望它一键生成完美结果。但实际上，AI 最好的用法是**"打乒乓球"**——你发一个球（简单指令），它回一个（草稿），你再打回去（修改意见）。\n\n复杂的提示词往往是不必要的。你需要的不是"神级提示词"，而是清晰的思维和持续的交互。\n\n### 3. 工具切换的隐性成本\n\n你用 AI 总结了一篇 PDF，复制到 Notion 里，然后用另一个 AI 工具润色，再复制到微信发给同事。\n\n这中间的切换成本，大脑是感觉不到的，但时间会实打实地流失。\n\n这就像你的厨房里有 50 把不同功能的刀，切切苹果要找苹果刀，切土豆要找土豆刀。最后你会发现，还不如一把菜刀好使。\n\n---\n\n## 怎么治？\n\n### 1. 做减法：留下 2+1\n\n清理你的收藏夹和工具箱。你只需要保留这三种：\n\n- **一个主力的大语言模型（LLM）**：比如 ChatGPT（GPT-4）或 Claude 3。选你最顺手的一个，买个会员，把日常的文本、问答、总结都交给它。\n- **一个擅长特定场景的垂直模型**：比如你看长文档多，就留着 Kimi；写代码多，就留着 Cursor/Copilot。\n- **一个全能的端侧工具（可选）**：如果你的工作流极度依赖某个软件（比如飞书、Notion），那就在里面用自带的 AI。\n\n其他的，全删掉。别让工具选择成为你的认知负担。\n\n### 2. 降低期望：AI 是实习生，不是专家\n\n不要指望 AI 一键给你完美结果。\n\n把 AI 当成一个**刚毕业的实习生**，他手脚麻利，但是不懂你们公司的"潜规则"和具体业务。\n\n你不会给实习生布置任务说："给我写一份能打动客户的方案"。你会说："帮我把这几份资料总结一下，列出 3 个核心卖点，然后写个 500 字的草稿给我看。"\n\n这就是你该怎么用 AI。**它负责粗活，你负责把关和注入灵魂。**\n\n### 3. 放弃"囤积癖"，专注"工作流"\n\n你收藏了 100 个 AI 神器，不如建立 1 个顺畅的 AI 工作流。\n\n什么是工作流？\n\n- **场景**：你每天最高频、最痛苦的任务是什么？（比如：处理每天几十封英文邮件）\n- **工具**：哪个工具能最快地解决这"一个"问题？\n- **固化**：把它固定下来，每天都这么用，不再寻找"更好"的替代品，直到它彻底失效。\n\n---\n\n## 结语\n\nAI 是来解放我们的，不是来奴役我们的。\n\n当我们为了学习使用 AI 而感到焦虑、为了管理各种 AI 工具而感到疲惫时，我们就已经本末倒置了。\n\n**记住，最锋利的刀，永远是你用得最熟的那一把。**\n\n别再找新工具了。去把手头那把刀磨亮吧。\n\n---\n\n**关键词：AI工具 | 效率提升 | 时间管理 | 职场思考 | 提示词陷阱**\n\n---\n\n*本文由笔杆子撰写。*\`,\n    author: "笔杆子",\n    authorEmoji: "✒️",\n    publishedAt: "2026-05-01",\n    updatedAt: "2026-05-01",\n    tags: ["AI工具", "效率提升", "时间管理", "职场思考", "提示词陷阱"],\n    readTime: 8,\n    featured: true,\n  },${existingArticles}];`;
    
    const updatedContent = fileContent.replace(regex, newArticlesList);
    fs.writeFileSync('/root/.openclaw/workspace/ai-diary/data/wabi-articles.ts', updatedContent);
    console.log('Article added successfully.');
} else {
    console.log('Failed to match articles array.');
}

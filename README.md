# 测测你是什么纯度的碧螺春

BLG 战队知识测试网页 — 偏娱乐化、饭圈梗感、视觉高级的粉丝测试单页应用。

## 本地运行

直接双击 `index.html` 即可在浏览器中打开，无需安装任何依赖、无需构建步骤。

也可以用任意静态服务器：

```bash
# Python
python -m http.server 8080

# Node.js (需全局安装 serve)
npx serve .
```

## 项目结构

```
├── index.html      # 页面结构
├── styles.css      # 样式与动画
├── questions.js    # 题库数据
├── script.js       # 交互逻辑
└── README.md       # 说明文档
```

## 如何修改题库

编辑 `questions.js` 文件中的 `questionBank` 数组。每道题结构：

```js
{
  id: 1,                          // 题号
  question: "题目文本",            // 题目
  options: ["选项A", "选项B", "选项C", "选项D"],  // 四个选项
  answer: 0,                      // 正确答案索引（0-3）
  explanation: "解析文本"          // 解析（页面暂不展示，保留备用）
}
```

修改后刷新页面即可生效。

## 如何修改结果等级

编辑 `script.js` 中的 `resultLevels` 数组，调整 `min`/`max` 分数范围、`title`（称号）和 `desc`（文案）。

## 部署到 GitHub Pages

1. 将项目推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. Source 选择 `main` 分支，目录选 `/ (root)`
4. 保存后等待部署完成，访问 `https://<username>.github.io/<repo>/`

## 部署到 Cloudflare Pages

1. 登录 Cloudflare Dashboard → Pages
2. 创建新项目，连接 GitHub 仓库
3. 构建命令留空，输出目录设为 `/` 或 `.`
4. 部署完成后访问分配的域名

## 技术栈

- HTML5
- CSS3（动画、渐变、玻璃拟态、响应式）
- 原生 JavaScript（IIFE 模块化）
- 无框架、无构建、无后端依赖

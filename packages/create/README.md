用于创建工程，技术栈模仿 create-vite

Seal Schema 类型提示生成方案，可以仿照 umi 或者 prisma，在 src 或者 node_modules 中生成临时文件，再从临时文件中读取类型提示。

```typescript
import { Schema$uap } from '@seal-container/client'

// Schema为前缀，$为分隔符，uap 为页面编码

export default defineSetup<Schema$uap>((ctx) => {})
```

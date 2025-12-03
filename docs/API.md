# API 文档与数据库设计

## 数据库设计 (Supabase)

### 1. Tools (工具表)
| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| name | text | 工具名称 |
| slug | text | URL 友好标识 (唯一) |
| description | text | 简介 |
| url | text | 工具链接 |
| category_id | uuid | 关联分类 ID |
| image_url | text | 封面图链接 |
| created_at | timestamp | 创建时间 |

### 2. Categories (分类表)
| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| name | text | 分类名称 |
| slug | text | URL 友好标识 |
| parent_id | uuid | 父分类 ID (可选) |

### 3. Reviews (评价表)
| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| tool_id | uuid | 关联工具 ID |
| user_id | uuid | 关联用户 ID |
| rating | int | 评分 (1-5) |
| comment | text | 评论内容 |
| created_at | timestamp | 评价时间 |

### 4. Favorites (收藏表)
| 字段名 | 类型 | 说明 |
| --- | --- | --- |
| id | uuid | 主键 |
| user_id | uuid | 关联用户 ID |
| tool_id | uuid | 关联工具 ID |
| created_at | timestamp | 收藏时间 |

## 服务端 API (Server Routes)

### `POST /api/migrate-articles`
- **描述**: 将本地 Nuxt Content 文章迁移至 Supabase (仅限管理员)。
- **Body**: 无。

*(后续可根据需求添加更多服务端聚合接口，大部分数据交互建议直接在客户端使用 Supabase SDK)*

export const rolePermissions = {
  super_admin: ["*"],
  admin: [
    "articles.publish",
    "settings.manage",
    "users.manage",
    "ads.manage",
    "homepage.manage"
  ],
  editor: ["articles.review", "articles.edit", "comments.moderate"],
  reporter: ["articles.create", "articles.edit.own"],
  author: ["articles.create", "articles.edit.own"],
  subscriber: ["articles.read", "comments.create"]
} as const;

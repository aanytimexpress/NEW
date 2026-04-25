# Database Blueprint

Bogura Kothon uses MongoDB with Mongoose models in `backend/src/models`.

Collections:

- `users`
- `articles`
- `categories`
- `tags`
- `comments`
- `media`
- `ads`
- `menus`
- `pages`
- `settings`
- `languages`
- `subscribers`
- `notifications`
- `districts`
- `upazilas`
- `homepageSections`
- `activitylogs`

Indexes:

- Full text index on article title/content (`bn`, `en`)
- Compound geo index for upazila under district
- Status/date indexes for publish scheduler
- Category/district/upazila indexes for local filtering

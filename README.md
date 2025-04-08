- /home
- /profile
- /profile/:id

* Features:

  - CRUD Post
  - Auth with NextAuth (Google,Github)
  - Add Friend
  - Change info
  - Search friend

* Integation features
  - Upload image/video to Cloudairy
  -

-- Fix api/friends/ - time 947ms

-- Fix getPosts - lấy ra các bài viết của bạn bè. hoặc bài viết đã xem.

- AI:
  Dịch ngôn ngữ: Có 1 video và nó auto dịch ngôn ngữ
  Tự động tạo nội dụng đề xuất: Ví dụ có 1 bức ảnh, và nó auto suggest các caption!.

  curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-proj-\_HaSEK6eDrkBTDL0LTf1dhj4TXySxqizneuBCbWUWtbA6qHGs2cTP3IvAyVN6X-0WH9m1UGLnyT3BlbkFJYnOkpKH4clGBAlv3BQUBmNGToemMrgxhnua-did-LKv_Hqrpj1XuG9xs92C-zq91BAKy3fR5sA" \
  -d '{
  "model": "gpt-4o-mini",
  "store": true,
  "messages": [
  {"role": "user", "content": "write a haiku about ai"}
  ]
  }'

- Setting.
- Post input => Rich text editor
- Header Post => Xem có add friend chưa, hiển thị button kết bạn.
- Hastag tìm kiếm
- Quyền riêng tư Post => DONE

* Maybe
  - Story.

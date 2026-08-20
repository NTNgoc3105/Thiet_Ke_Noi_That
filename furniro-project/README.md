# Furniro — Interior eCommerce (Đề 06)

Website được dựng lại theo tinh thần Figma **IntelliDesign / interior eCommerce** mà bạn cung cấp. Mình ưu tiên bám bố cục, màu, typography, tỷ lệ card và cách trình bày của màn hình Figma, đồng thời triển khai các luồng JavaScript mà đề bài yêu cầu.

## Trang
- Home
- Shop
- Product Detail
- Compare
- Cart
- Checkout
- Blog
- Contact
- Cart Sidebar (state mở từ mọi trang)
- About được thêm để có một trang nội dung thực riêng cho điều hướng.

## Tính năng JavaScript
- Product list render từ `data/products.json`
- Filter category + max price
- Search / sort / show / grid-list / pagination
- Product Detail gallery + size + color + quantity
- Compare bằng localStorage
- Cart sidebar + cart page đồng bộ bằng localStorage
- Free shipping threshold
- Checkout validation + save shipping info
- Discount code `FURNIRO10`
- Blog search + category filter
- Share bằng Clipboard API
- Mobile menu, search modal, account demo modal

## Chạy nhanh
Vì các trang dùng `fetch()` để đọc JSON, không nên mở trực tiếp bằng `file://`.

```bash
python -m http.server 5173
```

Sau đó mở `http://localhost:5173`.

## Vite / Tailwind
Project đã có `package.json` và `tailwind.config.js` để có thể chuyển sang quy trình build bằng Vite + Tailwind khi bạn muốn chuẩn hoá repo để nộp. Bản demo hiện dùng Tailwind Play CDN để bạn có thể chạy ngay và tập trung vào HTML semantic + JavaScript.

## Ghi chú nộp bài
- Hãy thay các thông tin contact demo bằng thông tin nhóm.
- Chạy Lighthouse và tối ưu ảnh thêm nếu cần mục tiêu 85+.
- Ghi nguồn Figma và phần AI hỗ trợ trong báo cáo theo yêu cầu đề.

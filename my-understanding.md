# My Understanding

Answer each question in your own words. There are no trick questions.

The goal is not a perfect answer — it is an honest one. Write as if you are explaining to a friend who has never used Express or React. There is no video for this assessment, so this document is where your understanding is actually assessed — take it seriously.

Do not copy from documentation, your code comments, or AI output. If you are unsure about something, write what you do understand and note where the gap is.

---

## AI Code Contribution

Rate yourself honestly using the scale below. This rating is not scored on its own — there is no "best" number to pick. What matters is that it's honest and matches what your code and your answers actually show.

| Rating | Description |
|---|---|
| 0 | **No AI use.** I did not use AI to generate code, explain concepts, debug, or teach me. |
| 1 | **AI used only for learning.** I did not use AI to generate code, but I used AI to explain concepts, clarify errors, or guide my understanding. |
| 2 | **Mixed coding with AI support.** I wrote some code myself and used some AI-generated code. I also used AI to help me understand, debug, or improve my solution. |
| 3 | **Learned from AI-generated code, then coded myself.** AI generated example code or guidance, but I used that understanding to write or adapt the final code myself. |
| 4 | **AI generated the code, but I fully understand it.** AI generated most or all of the code, but I can explain how it works, why it works, and how the main parts connect. |
| 5 | **AI generated the code with limited understanding.** AI generated most or all of the code, and I cannot confidently explain how or why everything works. |

**My rating:** 3

*คำอธิบายเพิ่มเติม:*  
ผมใช้ AI ช่วยแนะนำตัวอย่างโค้ด อธิบาย concept และช่วยตอนติดปัญหา แต่ผมไม่ได้เอาโค้ดมาใช้ทั้งหมดทันที ผมจะอ่านก่อนว่ามันทำอะไร แล้วค่อยปรับให้เข้ากับโปรเจกต์ของผม รวมถึงลองรันและแก้เองจนเข้าใจว่าแต่ละส่วนทำงานยังไงครับ

> If you rated **2 or higher**, also complete the "AI Process" section at the end of this document.

---

## Backend

**1. What does each HTTP method in your API mean — GET, POST, PUT or PATCH, and DELETE? Why do we use different methods instead of just using POST for everything?**

*Your answer:*  
ในโปรเจกต์ของผม
- `GET` ใช้ดึงข้อมูลสินค้า
- `POST` ใช้เพิ่มสินค้าใหม่
- `PUT` ใช้แก้ไขข้อมูลสินค้า
- `DELETE` ใช้ลบสินค้า ตามโจทย์ที่ให้มาครับ

ที่เราแยก method เพราะเวลาอ่าน API เราจะรู้เลยว่า request นั้นกำลังทำอะไร ถ้าใช้ POST หมดทุกอย่าง คนที่มาอ่านโค้ดหรือใช้งาน API ต่อจะเข้าใจยากกว่า และต้องคอยดูข้างในอีกทีว่า POST อันนี้เอาไว้เพิ่ม แก้ หรือลบครับ

---

**2. What is `express.json()` and what would happen if you left it out?**

*Your answer:*  
ผมเข้าใจว่า `express.json()` มีหน้าที่ช่วยให้ Express อ่านข้อมูล JSON ที่ frontend ส่งมาได้ เช่นตอนเพิ่มสินค้า frontend ส่งชื่อ ราคา และจำนวนมาใน request body แล้วผมจะเอาข้อมูลพวกนั้นมาใช้ผ่าน `req.body`

ถ้าไม่ใส่ `express.json()` Express จะอ่าน JSON ที่ส่งมาไม่ได้ตามปกติ ทำให้ `req.body` ไม่มีข้อมูลที่เราต้องการ และ route ที่เพิ่มหรือแก้สินค้าอาจทำงานไม่ได้ครับ

---

**3. What is the difference between `req.body`, `req.params`, and `req.query`? Give a real example from your API for each one.**

*Your answer:*  
3 ตัวนี้เอาไว้รับข้อมูลจาก request เหมือนกัน แต่รับมาจากคนละที่ครับ
- `req.body` คือข้อมูลที่ส่งมาใน body เช่น ตอนเพิ่มสินค้า `const { name, price, quantity } = req.body;`
- `req.params` คือค่าที่อยู่ใน path เช่น `/products/3` เลข 3 คือ Product ID และอ่านได้จาก `req.params.id`
- `req.query` คือค่าที่อยู่หลังเครื่องหมาย `?` เช่น `/products?search=shirt` เอาไปใช้กับการค้นหา filter หรือจะ sort ได้ครับ

---

**4. What are HTTP status codes? List every status code you used in your API and explain why you chose it for that situation.**

*Your answer:*  
Status code คือเลขที่ server ส่งกลับมาเพื่อบอกผลของ request ครับ ใน API ของผมจะมี
- `200` ใช้ตอน request สำเร็จ เช่น ดึงข้อมูลหรือแก้ไขข้อมูลสำเร็จ
- `201` ใช้ตอนสร้างสินค้าใหม่สำเร็จ
- `400` ใช้ตอนข้อมูลที่ส่งมาไม่ถูกต้อง เช่น กรอกข้อมูลไม่ครบ
- `404` ใช้ตอนหา Product ID ที่ระบุไม่เจอ
- `500` ใช้ตอนเกิด error ที่ฝั่ง server

ผมคิดว่าการมี status code ทำให้ frontend รู้ได้ง่ายขึ้นว่าควรทำอะไรต่อ จะแสดงข้อมูลหรือแสดง error ให้ผู้ใช้ ส่วนค่า status code เราไม่จำเป็นต้องจำทั้งหมด แต่เปิดอ่าน doc ตอนที่ใช้ได้ครับ

---

**5. What is middleware? Describe what it does in your own words and give one example from your code.**

*Your answer:*  
ผมมองว่า middleware เหมือนเป็นขั้นตอนที่ request ต้องผ่านก่อนจะเข้าไปถึง route จริง ๆ ครับ  
อย่างเช่น `app.use(express.json());` ตัวนี้จะช่วยจัดการ JSON ก่อน ทำให้ route ที่อยู่หลังจากนั้นอ่านข้อมูลจาก `req.body` ได้  
และผมก็มี request logger ด้วย เอาไว้ดูว่า request ที่เข้ามาเป็น method อะไรและเข้าที่ path ไหน ช่วยตอน debug ได้ครับ

---

**6. Why does the order of middleware matter in Express? What could go wrong if it were in the wrong order?**

*Your answer:*  
เพราะ Express อ่านโค้ดตามลำดับจากบนลงล่างครับ ถ้า route ของผมต้องใช้ `req.body` ผมต้องใส่ `app.use(express.json());` ไว้ก่อน route  
ถ้าเอา `express.json()` ไปไว้หลัง route ตอน request มาถึง route ข้อมูล JSON มันจะยังไม่ได้ถูกจัดการ ทำให้ `req.body` ไม่มีข้อมูล เพราะฉะนั้นผมต้องคิดว่าแต่ละ route ต้องผ่าน middleware อะไรก่อน แล้วเรียงลำดับให้ถูกครับ

---

**7. Walk through what happens on the server, step by step, when a POST request is sent to `/products`.**

*Your answer:*  
ตอน frontend ส่ง `POST /products` ผมเข้าใจขั้นตอนประมาณนี้ครับ
1. Request เข้ามาที่ Express server
2. ผ่าน middleware ที่ผมตั้งไว้ เช่น CORS, express.json() และ logger
3. Express ดูว่า request นี้เป็น POST `/products` จากนั้นส่งไปที่ products route
4. Route อ่านข้อมูลจาก `req.body` ตรวจว่าข้อมูลที่ส่งมาถูกต้องหรือครบไหม
5. ถ้าถูกต้องก็สร้าง Product ใหม่ เก็บ Product เข้าไปในข้อมูลของระบบ (in-memory)
6. Server ส่งข้อมูล Product กลับไปพร้อม status 201
7. Frontend รับ response แล้วนำไปอัปเดตหน้าจอครับ

---

**8. What is CRUD? Map each operation to the HTTP method and route you used in your API.**

*Your answer:*  
CRUD คือการทำงานพื้นฐานกับข้อมูล มี Create, Read, Update และ Delete ครับ  
ในโปรเจกต์ผมจับคู่ประมาณนี้

| CRUD | Method | Route |
|---|---|---|
| Create | POST | /products |
| Read All | GET | /products |
| Read One | GET | /products/:id |
| Update | PUT | /products/:id |
| Delete | DELETE | /products/:id |

ผมใช้โครงสร้างแบบนี้เพราะเวลาเห็น method กับ route จะเข้าใจได้เลยว่ากำลังจัดการ Product แบบไหนครับ

---

**9. How does your API respond when something goes wrong — for example, when a product with a given ID does not exist?**

*Your answer:*  
ถ้ามีการส่ง ID ที่ไม่มีอยู่จริงเข้ามา ผมจะให้ backend ตรวจสอบก่อนว่าหา Product เจอไหม  
ถ้าไม่เจอก็จะไม่ทำการแก้ไขหรือลบต่อ แต่ส่ง 404 Not Found กลับไปพร้อมข้อความบอก เช่น
```json
{
  "error": "Product with ID '...' not found."
}
```
ผมคิดว่าแบบนี้ดีกว่าปล่อยให้ server error เพราะ frontend จะรู้ด้วยว่าปัญหาคือหา Product ไม่เจอ แล้วเอาไปเตือนผู้ใช้ได้ครับ

---

## Frontend & Integration

**10. What is CORS, and what problem does it solve? What would you see in your browser if it wasn't configured on your server?**

*Your answer:*  
CORS เป็นเรื่องของการอนุญาตให้ frontend ที่อยู่คนละ origin กับ backend เรียก API กันได้ครับ  
ในโปรเจกต์ผม React กับ Express รันคนละ port ถึงจะอยู่ในเครื่องเดียวกันก็ถือว่าเป็นคนละ origin เลยต้องตั้ง CORS ที่ backend เพื่ออนุญาตให้ frontend เรียก API ได้  
ถ้าไม่ได้ตั้งไว้ เวลา fetch จาก React ตัว browser จะ block request และใน Console จะเห็นข้อความ error เกี่ยวกับ CORS policy ครับ

---

**11. Where does your React app fetch data from your API? Walk through what `useEffect` is doing in that code, and why the fetch isn't just called directly in the component body.**

*Your answer:*  
Frontend ของผมดึงข้อมูล Product จาก backend ผ่าน API `/products` ครับ  
ผมใช้ `useEffect` ให้เรียก function โหลดข้อมูลตอน component เปิดขึ้นมาครั้งแรก เช่น
```javascript
useEffect(() => {
  fetchProducts();
}, []);
```
ที่ไม่เรียก fetch ตรง ๆ ใน component body เพราะเวลา fetch เสร็จ ผมจะมีการอัปเดต state แล้ว React จะ render ใหม่  
ถ้ามี fetch อยู่ใน body มันก็อาจถูกเรียกใหม่อีกเรื่อย ๆ ทำให้ยิง request ซ้ำไปเรื่อย ๆ แบบไม่สิ้นสุด (infinite loop) ได้ครับ

---

**12. Where is your API's base URL defined, and why did you put it there instead of hardcoding it in every fetch call?**

*Your answer:*  
ผมเก็บ API base URL ไว้ใน `.env` ของ frontend (`VITE_API_URL`) แล้วเรียกผ่าน `import.meta.env`  
เหตุผลที่ทำแบบนี้คือ ถ้าวันหนึ่ง URL backend เปลี่ยน ผมแก้ที่เดียวได้เลย ไม่ต้องไปไล่แก้ทุก fetch  
ผมคิดว่ามันทำให้โค้ดจัดการง่ายกว่า และแยกค่าที่เป็น config ออกจากโค้ดหลักครับ

---

**13. Pick one action in your app — for example, deleting a product. Walk through the full round trip: what happens from the moment the user clicks the button, to the request reaching your server, to the screen updating with the new list.**

*Your answer:*  
การเดินทางแบบครบวงจรของการลบ Product
1. ตอนผู้ใช้กดปุ่ม Delete frontend จะรู้ว่าต้องลบ Product ID ไหน
2. จากนั้น frontend ส่ง `DELETE /products/:id` ไปที่ backend
3. Express รับ request แล้ว route จะเอา ID จาก `req.params.id` ไปค้นหา Product
4. ถ้าหาเจอก็ลบข้อมูลออก แล้วส่ง response กลับมาว่าลบสำเร็จ
5. หลังจาก frontend ได้ response กลับมา ผมจะอัปเดต Product list ใหม่ใน state
6. พอ state เปลี่ยน React ก็ render ใหม่ ทำให้ Product ที่ลบหายจากหน้าจอ โดยผู้ใช้ไม่ต้องกด refresh เองครับ

---

**14. What does your app show the user while data is loading, and what does it show if the fetch fails (e.g. the server isn't running)? Why does that matter?**

*Your answer:*  
ตอนกำลังโหลด ผมมี loading state เพื่อบอกว่าระบบกำลังโหลดข้อมูลอยู่  
ถ้า fetch ไม่สำเร็จ อย่างเช่น backend ไม่ได้เปิด ผมจะแสดงข้อความ error ให้ผู้ใช้รู้ว่าโหลดข้อมูลไม่ได้  
ผมคิดว่าส่วนนี้สำคัญ เพราะถ้าหน้าจอว่างอย่างเดียว ผู้ใช้จะไม่รู้ว่าระบบกำลังโหลดหรือจริง ๆ แล้วมันพังครับ

---

**15. After you add, edit, or delete a product, your on-screen list updates without a page refresh. Explain how — what actually causes React to re-render with the new data?**

*Your answer:*  
เพราะ Product list อยู่ใน React state ครับ  
หลังจากเพิ่ม แก้ หรือลบสำเร็จ ผมจะเปลี่ยนค่า state ให้เป็นข้อมูลล่าสุด  
เมื่อ state เปลี่ยน React จะ render component ใหม่ให้อัตโนมัติ เลยทำให้ข้อมูลบนหน้าจอเปลี่ยนตามโดยที่ไม่ต้อง refresh หน้าเว็บเองครับ

---

**16. What was the hardest part of connecting your React app to your Express API, and what did you do to get past it?**

*Your answer:*  
ส่วนที่ผมรู้สึกว่ายากคือ ตอนที่ frontend เรียก backend แล้วเกิด error เพราะตอนแรกยังแยกไม่ออกว่าปัญหาอยู่ตรงไหน มันอาจเกิดจาก URL ผิด, method ผิด, body ที่ส่งไปไม่ตรง, ติด CORS หรือ backend ไม่ได้เปิดก็ได้  
วิธีที่ผมใช้คือแยกทดสอบทีละฝั่ง ก่อนอื่นผมใช้ `requests.http` ยิง API โดยตรงก่อน ถ้าตรงนั้นทำงาน แปลว่า backend น่าจะโอเค  
หลังจากนั้นค่อยกลับไปเช็ก React แล้วดู Console และ Network ใน browser ว่าส่ง request อะไรออกไปและ server ตอบอะไรกลับมา วิธีนี้ช่วยให้ผมหาสาเหตุได้ง่ายกว่าการแก้พร้อมกันทั้งสองฝั่งครับ

---

## AI Process

Only complete this section if you rated yourself **2 or higher** on the AI Code Contribution Scale above. If you rated 0 or 1, write "N/A" under each question.

**17. If you used AI to generate any code, how did you break the work into steps or prompts? Give one example of a specific prompt you used, rather than a single "build the whole app" request.**

*Your answer:*  
ผมไม่ได้สั่ง AI ครั้งเดียวให้ทำทั้งโปรเจกต์ แต่ผมแบ่งถามทีละเรื่อง อย่างตอนทำ backend ผมจะแยกเป็น setup Express ก่อน แล้วค่อยทำ Product model จากนั้นค่อยทำ CRUD route และสุดท้ายค่อยเชื่อมกับ frontend  
ตัวอย่าง prompt ที่ผมใช้ประมาณว่า
> "ช่วยดู CRUD route ของ Product ให้หน่อย ผมต้องการ GET, POST, PUT และ DELETE โดยใช้ Express Router และช่วยอธิบายด้วยว่าแต่ละ route รับข้อมูลจากตรงไหน"

หลังจากได้ตัวอย่าง ผมจะเอามาดูเทียบกับโค้ดตัวเอง แล้วค่อยปรับ ไม่ได้ copy มาทั้งหมดแบบไม่อ่านครับ

---

**18. Describe one specific thing an AI tool generated that you changed, corrected, or rejected — and why.**

*Your answer:*  
ผมแก้จากที่ AI ช่วยค่อนข้างเยอะตรงหน้า Admin Dashboard ครับ  
ตอนแรก AI ช่วยเรื่องโครง UI ให้ แต่ผมรู้สึกว่าหน้าตายังไม่ใช่แบบที่ผมอยากได้  
ผมเลยไปหา reference เพิ่ม แล้วเปลี่ยน layout, สี, spacing, ปุ่ม, form, และรูปแบบตารางเอง  
เหตุผลที่ผมแก้ เพราะผมอยากให้หน้าเว็บดูเป็น Shopping Cart Admin มากขึ้น และใช้งานง่ายกว่าแบบแรกครับ

---

**19. Describe one real bug or error you ran into while building this. How did you actually figure out what was wrong, beyond pasting the error back into the chat?**

*Your answer:*  
ตอน build frontend ผมเคยใช้คำสั่ง `npm run buil` แล้วขึ้น error
`Missing script: "buil"`

ผมอ่าน error แล้วเห็นว่ามันแนะนำ `npm run build` จากนั้นผมไปดูใน `package.json` ว่าใน scripts มีชื่ออะไรบ้าง แล้วเห็นว่าจริง ๆ มี `build` แต่ไม่มี `buil` เลยรู้ว่าปัญหาไม่ได้เกิดจาก React หรือ Vite แต่ผมพิมพ์คำสั่งตกตัว 'd'  
พอแก้เป็น `npm run build` ก็สามารถ build ต่อได้ อันนี้ทำให้ผมรู้ว่าก่อนจะแก้โค้ดควรอ่าน error ให้ครบก่อน เพราะบางทีปัญหาไม่ได้อยู่ในโค้ดเลยครับ

---

**20. Pick one route (backend) or one component (frontend) that AI helped generate. Without looking back at your AI chat history, explain what it does and why it works, in your own words.**

*Your answer:*  
ผมเลือก **POST /products** ครับ  
route นี้เอาไว้เพิ่มสินค้าใหม่
1. ตอน frontend ส่งข้อมูลมา เช่นชื่อสินค้า ราคา และจำนวน ข้อมูลจะเข้ามาอยู่ใน request body
2. ก่อนถึง route request จะผ่าน `express.json()` ก่อน ทำให้ Express อ่าน JSON ได้
3. จากนั้นใน route ผมเอาข้อมูลจาก `req.body` มาตรวจว่าข้อมูลที่จำเป็นมีครบหรือไม่
4. ถ้าข้อมูลถูกต้องก็สร้าง Product ใหม่แล้วเพิ่มเข้าไปในข้อมูลของระบบ
5. สุดท้าย server ส่ง Product ที่เพิ่งสร้างกลับไปพร้อม status 201

ที่มันทำงานได้เพราะแต่ละส่วนต่อกันเป็นลำดับครับ คือ frontend ส่ง request ➔ middleware จัดการ JSON ➔ route รับข้อมูลและสร้าง Product ➔ ส่ง response กลับไปให้ frontend อัปเดตหน้าจอครับ

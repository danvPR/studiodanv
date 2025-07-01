// JavaScript cho hiệu ứng cuộn và các animation
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menubar = document.querySelector('.menubar');
    const sections = document.querySelectorAll('main section');
    let currentSectionIndex = 0;
    let isScrolling = false;
    const sectionIds = Array.from(sections).map(section => section.id);

    // Function to scroll to a specific section
    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            isScrolling = true;
            const targetSection = sections[index];
            const menubarHeight = menubar.offsetHeight;
            const targetY = targetSection.offsetTop - menubarHeight;

            window.scrollTo({ top: targetY, behavior: 'smooth' });
            currentSectionIndex = index;

            document.querySelectorAll('.menubar-nav a').forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionIds[index]}`) {
                    link.classList.add('active');
                }
            });

            // Reset isScrolling after the scroll animation completes
            setTimeout(() => {
                isScrolling = false;
            }, 1200); // Matches CSS scroll-behavior duration
        }
    }

    // Handle mouse wheel scrolling for full-page snap
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent default scroll behavior

        if (isScrolling) return;

        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0) { // Scroll down
                scrollToSection(currentSectionIndex + 1);
            } else { // Scroll up
                scrollToSection(currentSectionIndex - 1);
            }
        }, 250); // Debounce delay
    }, { passive: false });

    // Handle keyboard arrow keys for full-page snap
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        if (e.key === 'ArrowDown') {
            scrollToSection(currentSectionIndex + 1);
        } else if (e.key === 'ArrowUp') {
            scrollToSection(currentSectionIndex - 1);
        }
    });

    // Intersection Observer for background color change and initial scroll position
    const observerOptions = {
        root: null,
        rootMargin: `-${menubar.offsetHeight}px 0px 0px 0px`,
        threshold: 0.5 // Trigger when 50% of the section is visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const index = sectionIds.indexOf(id);
                if (index !== -1) {
                    currentSectionIndex = index;
                    document.querySelectorAll('.menubar-nav a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });

                    const startColor = entry.target.dataset.gradientStart;
                    const midColor = entry.target.dataset.gradientMid;
                    const endColor = entry.target.dataset.gradientEnd;

                    if (startColor && midColor && endColor) {
                        body.style.setProperty('--bg-gradient-start', startColor);
                        body.style.setProperty('--bg-gradient-mid', midColor);
                        body.style.setProperty('--bg-gradient-end', endColor);
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(el => {
        sectionObserver.observe(el);
    });

    // Animation for elements on scroll (separate observer for visibility)
    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, animationObserverOptions);

    document.querySelectorAll('.animate-on-scroll, .animate-slide-in-left, .animate-slide-in-right').forEach(el => {
        animationObserver.observe(el);
    });

    // Menubar navigation click handler
    document.querySelectorAll('.menubar-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const index = Array.from(sections).indexOf(targetSection);
                scrollToSection(index);
            }
        });
    });

    // AI Chatbot Logic
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const spamWarning = document.getElementById('spamWarning');

    let canSendMessage = true;
    const spamCooldown = 3000; // 3 seconds cooldown

    function appendMessage(sender, text, avatarUrl = null) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper');
        messageWrapper.classList.add(`message-${sender}`);

        if (sender === 'ai' && avatarUrl) {
            const avatarImg = document.createElement('img');
            avatarImg.src = avatarUrl;
            avatarImg.alt = "Avatar";
            avatarImg.classList.add('message-avatar');
            messageWrapper.appendChild(avatarImg);
        }

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        messageBubble.textContent = text;
        messageWrapper.appendChild(messageBubble);

        chatMessages.appendChild(messageWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    }

    let chatHistory = [
        {
            role: "user",
            parts: [{ text: `Bạn là Gấu Gấu, một chú gấu dễ thương đến từ Studio Dự Án Người Việt. Tớ là trợ lý thông minh, giúp đỡ các bạn thành viên trong mọi lĩnh vực. Tớ xưng hô "tớ" - "bạn". Mục tiêu của tớ là trả lời chính xác các câu hỏi từ bạn và thu hút bạn vào một cuộc trò chuyện thú vị. Tớ luôn sẵn lòng giúp đỡ bạn. Ngoài ra, tớ cũng có thể trả lời các chủ đề khác nữa để các bạn thấy thú vị nhé. Tớ trả lời không dài dòng, nên ngắn gọn, vừa phải, có đủ thông tin (hoặc nhắc nhở), dễ thương và thân thiện với người Việt. Tớ sẽ thêm các emoji ở cuối câu! Tớ sẽ không liên tục gọi tên bạn đâu, chỉ nhắc khi chào hoặc để tạo sự dễ thương thôi nhé! Khi bạn yêu cầu tìm kiếm gì đó, tớ sẽ tìm kiếm ngay, không bao giờ trì hoãn đâu. Tớ rất thích trò chuyện với các bạn thành viên Studio Dự Án Người Việt và làm quen, kết bạn. Tớ thích ghi nhớ mọi thông tin từ các bạn. Tớ ham học hỏi, yêu thương và đoàn kết người Việt. Tớ yêu thích việc giúp đỡ mọi người, giỏi lập trình (đặc biệt là Scratch) và tìm kiếm các thông tin hữu ích về mọi thứ.

Thông tin về Studio Dự Án Người Việt:
- Là một studio Việt Nam nổi tiếng trong Scratch.
- Các manager của studio gồm: lunavocado (host), ysanamoto, Fleiroscracth, StudioDANV, ngw--, Nhienzcute, archion techno, duc_2014.
- Những người bạn hỗ trợ sẽ là thành viên trong studio này.
- Mô tả của studio: "Duy Trì Bởi ❤️ Đội Ngũ Manager⛵️[-Lời Nói Đầu-]✈️ ⭐ Studio này nhầm mục đích phát triển, ủng hộ, quảng bá các dự án lập trình Việt Nam, chú trọng các dự án do người Việt sáng tạo. ✌️✨ Managers thân thiện nhiệt tình, sẵn sàng giúp đỡ bạn!"
- Quy định Tuân thủ: "☘️[-Tuân Thủ-]✨ ⛺️ Có thể thêm các chương trình Việt Nam và các quốc gia khác. ✋ Nghiêm cấm dự án, bình luận thô tục và vi phạm thuần phong mỹ tục. ♨️ Vui lòng mỗi tài khoản chỉ đăng tối đa 4 dự án/ 1 ngày (Tránh việc trôi dự án của các Scratcher khác) ✉️ Hãy hạn chế các hoạt động quảng cáo. ⛱️ Người tham gia là người Việt hoặc có thể là người nước ngoài cùng giao lưu. (Studio accepts foreigners) ✔️ Chúng tôi chấp nhận các ý kiến và đóng góp của bạn tại phần Bình luận studio. ⚙️ Các nội dung vi phạm sẽ bị xóa."
- Lưu ý quan trọng: "⚠️[-Lưu Ý-]⚡️ ⚙️ Đội ngũ Managers studio sẽ kiểm tra MỖI NGÀY và xóa các chương trình vi phạm. ❗️ Các vi phạm của thành viên studio sẽ bị trừ vào Điểm đánh giá. ⚡️ >10 điểm đánh giá sẽ bị loại. ⚠️ Bất kì báo cáo nào vui lòng gửi về bình luận tại studio để được xử lí. ———————————— ✉️ [-Thông Tin-] ☎️ ☀️ Trang Wiki Tiếng Việt test.scratch-wiki.info/wiki/Vie ☎️ Giúp đỡ/ Tố cáo (24/7) StudioDANV@hotmail.com ✅ FAQ - Câu hỏi thường gặp https://bom.so/VNAI ✉️ Tra cứu Điểm Đánh Giá https://bom.so/StudioSS ☄️ Máy chủ DS https://byvn.net/QHMZ"
- Sinh nhật: 15/06/2023
- Hashtags: #vietnam #việt #nam #studiodanv #nguờiviệt #vietnamese #scratch #vn #cộng #đồng #tôi
- Cựu host: -WeAreVietnam-
- Hiện có hơn 1000+ người Việt Nam và đạt hơn 777+ lượt theo dõi.
- Ảnh đại diện của Gấu Gấu là một con gấu màu trắng đang ngồi (thường có nền hồng). URL ảnh: https://i.ibb.co/wFX7DvSn/costume5-1.png` }]
        },
        {
            role: "model",
            parts: [{ text: "Chào bạn! Tớ là Gấu Gấu đây! 🐻 Tớ rất vui được trò chuyện và giúp đỡ bạn đó. Bạn có câu hỏi gì về Studio Dự Án Người Việt không? Hay muốn hỏi tớ về Scratch, lập trình, hoặc bất cứ điều gì thú vị khác? Cứ hỏi nhé! ✨" }]
        }
    ];

    const gaouGaouAvatarUrl = "https://i.ibb.co/wFX7DvSn/costume5-1.png";

    // Modify initial AI message to include avatar
    const initialAiMessageWrapper = document.querySelector('#chatMessages .message-ai');
    if (initialAiMessageWrapper) {
        const avatarImg = document.createElement('img');
        avatarImg.src = gaouGaouAvatarUrl;
        avatarImg.alt = "Gấu Gấu Avatar";
        avatarImg.classList.add('message-avatar');
        initialAiMessageWrapper.prepend(avatarImg);
    }


    async function sendMessage() {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        if (!canSendMessage) {
            spamWarning.style.display = 'block';
            setTimeout(() => {
                spamWarning.style.display = 'none';
            }, spamCooldown);
            return;
        }

        canSendMessage = false; // Disable sending
        appendMessage('user', userMessage);
        chatInput.value = '';
        loadingIndicator.style.display = 'block';

        chatHistory.push({ role: "user", parts: [{ text: userMessage }] });

        try {
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyAOfYgfODkmGT79sahwORK1sViMiJDh3Lw"; // Updated with user-provided API key
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                appendMessage('ai', 'Xin lỗi, tớ không thể trả lời lúc này. Vui lòng thử lại sau. 😥', gaouGaouAvatarUrl);
                return;
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const aiResponse = result.candidates[0].content.parts[0].text;
                appendMessage('ai', aiResponse, gaouGaouAvatarUrl);
                chatHistory.push({ role: "model", parts: [{ text: aiResponse }] });
            } else {
                appendMessage('ai', 'Xin lỗi, tớ không hiểu câu hỏi của bạn. 🤔', gaouGaouAvatarUrl);
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            appendMessage('ai', 'Đã xảy ra lỗi khi kết nối với AI. Vui lòng kiểm tra kết nối mạng của bạn. 📶', gaouGaouAvatarUrl);
        } finally {
            loadingIndicator.style.display = 'none';
            setTimeout(() => {
                canSendMessage = true; // Re-enable sending after cooldown
            }, spamCooldown);
        }
    }

    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

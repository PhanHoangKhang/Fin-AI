const BASE_URL = 'http://localhost:8080/api/v1';

// Hàm helper fetch chung
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Định nghĩa các hàm gọi API cho News
export const newsService = {
  // Lấy danh sách tin tức feed
  getFeed: () => fetchAPI<any[]>('/news/feed'),

  // Lấy chi tiết 1 bài viết theo ID (Dùng chung fetchAPI)
  getById: (id: string) => fetchAPI<any>(`/news/${id}`),
};
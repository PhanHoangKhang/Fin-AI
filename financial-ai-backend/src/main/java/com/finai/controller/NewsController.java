package com.finai.controller;

import com.finai.dto.NewsDetailDto;
import com.finai.dto.NewsDto;
import com.finai.service.NewsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/news")
@CrossOrigin(origins = "*") // Đảm bảo React gọi không bị dính lỗi CORS
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/feed")
    public List<NewsDto> getNewsFeed() {
        return newsService.fetchAndProcessNews();
    }

    
}
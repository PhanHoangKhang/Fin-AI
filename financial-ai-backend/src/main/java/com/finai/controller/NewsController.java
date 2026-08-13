package com.finai.controller;

import com.finai.dto.NewsDetailDto;
import com.finai.dto.NewsDto;
import com.finai.service.NewsService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/news")
@CrossOrigin(origins = "*")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping("/feed")
    public List<NewsDto> getNewsFeed() {
        return newsService.fetchAndProcessNews();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable("id") String id) {
        try {
            NewsDetailDto detail = newsService.getNewsById(id);
            
            if (detail == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Không tìm thấy tin tức với ID: " + id));
            }
            
            return ResponseEntity.ok(detail);

        } catch (Exception e) {
            // Log lỗi ra Console/File log để dễ debug
            System.err.println(" Lỗi khi lấy chi tiết tin tức ID [" + id + "]: " + e.getMessage());
            e.printStackTrace();

            // Trả về lỗi 500 kèm message rõ ràng thay vì để Server sập
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                        "error", "Lỗi xử lý hệ thống hoặc API AI bị nghẽn",
                        "details", e.getMessage() != null ? e.getMessage() : "Unknown error"
                    ));
        }
    }
}
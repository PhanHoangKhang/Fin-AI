package com.finai.controller;

import com.finai.dto.GlossaryDto;
import com.finai.service.GlossaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/glossary")
@CrossOrigin(origins = "*")
public class GlossaryController {

    @Autowired
    private GlossaryService glossaryService;

    @GetMapping
    public ResponseEntity<List<GlossaryDto>> getGlossary(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String letter
    ) {
        List<GlossaryDto> list = glossaryService.getAllGlossary(keyword, category, letter);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GlossaryDto> getGlossaryById(@PathVariable String id) {
        GlossaryDto item = glossaryService.getGlossaryById(id);
        if (item == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(item);
    }
}
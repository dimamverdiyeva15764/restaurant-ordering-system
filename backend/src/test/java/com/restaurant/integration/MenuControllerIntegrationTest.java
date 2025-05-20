package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.MenuCategory;
import com.restaurant.model.MenuItem;
import com.restaurant.repository.MenuCategoryRepository;
import com.restaurant.repository.MenuItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MenuControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MenuCategoryRepository categoryRepository;

    @Autowired
    private MenuItemRepository itemRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private MenuCategory testCategory;

    @BeforeEach
    void setup() {
        itemRepository.deleteAll();
        categoryRepository.deleteAll();

        testCategory = new MenuCategory();
        testCategory.setName("Appetizers");
        testCategory.setActive(true);
        testCategory.setDisplayOrder(1);
        testCategory = categoryRepository.save(testCategory);
    }

    @Test
    void testCreateMenuItem_success() throws Exception {
        MenuItem item = new MenuItem();
        item.setName("Spring Rolls");
        item.setDescription("Crispy rolls");
        item.setPrice(BigDecimal.valueOf(5.99));
        item.setAvailable(true);
        item.setVegetarian(true);
        item.setVegan(false);
        item.setGlutenFree(true);
        item.setCategory(testCategory);

        mockMvc.perform(post("/api/menu/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Spring Rolls"));
    }

    @Test
    void testGetAllMenuItems_returnsList() throws Exception {
        MenuItem item = new MenuItem();
        item.setName("Burger");
        item.setPrice(BigDecimal.valueOf(8.50));
        item.setAvailable(true);
        item.setVegetarian(false);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setCategory(testCategory);
        itemRepository.save(item);

        mockMvc.perform(get("/api/menu/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void testUpdateMenuItem_success() throws Exception {
        MenuItem item = new MenuItem();
        item.setName("Fries");
        item.setPrice(BigDecimal.valueOf(3.0));
        item.setAvailable(true);
        item.setVegetarian(true);
        item.setVegan(true);
        item.setGlutenFree(true);
        item.setCategory(testCategory);
        item = itemRepository.save(item);

        item.setPrice(BigDecimal.valueOf(3.5));

        mockMvc.perform(put("/api/menu/items/" + item.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(item)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.price").value(3.5));
    }

    @Test
    void testDeleteMenuItem_success() throws Exception {
        MenuItem item = new MenuItem();
        item.setName("Wings");
        item.setPrice(BigDecimal.valueOf(7.0));
        item.setAvailable(true);
        item.setVegetarian(false);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setCategory(testCategory);
        item = itemRepository.save(item);

        mockMvc.perform(delete("/api/menu/items/" + item.getId()))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateCategory_success() throws Exception {
        MenuCategory category = new MenuCategory();
        category.setName("Drinks");
        category.setActive(true);
        category.setDisplayOrder(2);

        mockMvc.perform(post("/api/menu/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(category)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Drinks"));
    }

    @Test
    void testGetAllCategories_returnsList() throws Exception {
        mockMvc.perform(get("/api/menu/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Appetizers"));
    }

    @Test
    void testSearchMenuItems_returnsMatch() throws Exception {
        MenuItem item = new MenuItem();
        item.setName("Cheese Pizza");
        item.setPrice(BigDecimal.valueOf(9.0));
        item.setAvailable(true);
        item.setVegetarian(true);
        item.setVegan(false);
        item.setGlutenFree(false);
        item.setCategory(testCategory);
        itemRepository.save(item);

        mockMvc.perform(get("/api/menu/items/search")
                        .param("query", "cheese"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Cheese Pizza"));
    }

    @Test
    void testFilterMenuItems_byVegetarian() throws Exception {
        MenuItem item1 = new MenuItem();
        item1.setName("Veg Salad");
        item1.setPrice(BigDecimal.valueOf(8.99));
        item1.setAvailable(true);
        item1.setVegetarian(true);
        item1.setVegan(false);
        item1.setGlutenFree(true);
        item1.setCategory(testCategory);

        MenuItem item2 = new MenuItem();
        item2.setName("Chicken Wings");
        item2.setPrice(BigDecimal.valueOf(9.99));
        item2.setAvailable(true);
        item2.setVegetarian(false);
        item2.setVegan(false);
        item2.setGlutenFree(false);
        item2.setCategory(testCategory);

        itemRepository.saveAll(List.of(item1, item2));

        mockMvc.perform(get("/api/menu/items/filter")
                        .param("isVegetarian", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Veg Salad"));
    }
}

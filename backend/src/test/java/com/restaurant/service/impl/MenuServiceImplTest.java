package com.restaurant.service.impl;

import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.model.MenuCategory;
import com.restaurant.model.MenuItem;
import com.restaurant.repository.MenuCategoryRepository;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.service.MenuService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class MenuServiceImplTest {

    @Mock
    private MenuItemRepository menuItemRepository;

    @Mock
    private MenuCategoryRepository menuCategoryRepository;

    @InjectMocks
    private MenuServiceImpl menuService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createMenuItem_success() {
        MenuCategory category = new MenuCategory();
        category.setId(1L);

        MenuItem item = new MenuItem();
        item.setName("Pizza");
        item.setCategory(category);

        when(menuCategoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(menuItemRepository.save(any(MenuItem.class))).thenReturn(item);

        MenuItem saved = menuService.createMenuItem(item);

        assertEquals("Pizza", saved.getName());
        verify(menuItemRepository).save(item);
    }

    @Test
    void createMenuItem_categoryNotFound() {
        MenuCategory category = new MenuCategory();
        category.setId(99L);

        MenuItem item = new MenuItem();
        item.setName("Burger");
        item.setCategory(category);

        when(menuCategoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> menuService.createMenuItem(item));
    }

    @Test
    void updateMenuItem_success() {
        MenuCategory oldCategory = new MenuCategory();
        oldCategory.setId(1L);

        MenuCategory newCategory = new MenuCategory();
        newCategory.setId(2L);

        MenuItem existing = new MenuItem();
        existing.setId(10L);
        existing.setName("Salad");
        existing.setCategory(oldCategory);

        MenuItem updated = new MenuItem();
        updated.setId(10L);
        updated.setName("Salad");
        updated.setCategory(newCategory);

        when(menuItemRepository.findById(10L)).thenReturn(Optional.of(existing));
        when(menuCategoryRepository.findById(2L)).thenReturn(Optional.of(newCategory));
        when(menuItemRepository.save(updated)).thenReturn(updated);

        MenuItem result = menuService.updateMenuItem(updated);

        assertEquals("Salad", result.getName());
        assertEquals(2L, result.getCategory().getId());
    }

    @Test
    void deleteMenuItem_success() {
        when(menuItemRepository.existsById(1L)).thenReturn(true);

        menuService.deleteMenuItem(1L);

        verify(menuItemRepository).deleteById(1L);
    }

    @Test
    void deleteMenuItem_notFound() {
        when(menuItemRepository.existsById(99L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> menuService.deleteMenuItem(99L));
    }

    @Test
    void getMenuItemsByCategory_success() {
        MenuCategory category = new MenuCategory();
        category.setId(1L);

        MenuItem item1 = new MenuItem();
        item1.setName("Soup");
        item1.setCategory(category);

        when(menuCategoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(menuItemRepository.findByCategory(category)).thenReturn(List.of(item1));

        List<MenuItem> items = menuService.getMenuItemsByCategory(1L);

        assertEquals(1, items.size());
        assertEquals("Soup", items.get(0).getName());
    }

    @Test
    void filterMenuItems_mixedFilter() {
        MenuItem item1 = new MenuItem();
        item1.setName("Veg Pizza");
        item1.setVegetarian(true);
        item1.setVegan(false);
        item1.setGlutenFree(true);

        MenuItem item2 = new MenuItem();
        item2.setName("Vegan Salad");
        item2.setVegetarian(true);
        item2.setVegan(true);
        item2.setGlutenFree(false);

        when(menuItemRepository.findAll()).thenReturn(Arrays.asList(item1, item2));

        List<MenuItem> result = menuService.filterMenuItems(true, true, null);

        assertEquals(1, result.size());
        assertEquals("Vegan Salad", result.get(0).getName());
    }
}

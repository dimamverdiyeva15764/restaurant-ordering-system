// filepath: c:\Users\hp\Desktop\web2project\src\main\java\com\restaurant\model\Order.java
package com.restaurant.model;

import java.util.List;

public class Order {
    private Long id;
    private List<MenuItem> items;
    private String status;

    public Order() {
        this.status = "Pending";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<MenuItem> getItems() {
        return items;
    }

    public void setItems(List<MenuItem> items) {
        this.items = items;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
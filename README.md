# 🎯 Valorant Loadout Tracker  
A full-stack web application built with **Django (backend)** and **React + TypeScript (frontend)** that allows users to create, manage, and analyze their Valorant loadouts.  
This project was developed as part of **CS 348 – Information Systems**, demonstrating database design, transactional behavior, indexing, and SQL-safe application development.

---

# 🚀 Features

## ✔ Stage 1 — Database Design & ERD  
- Designed the full data model: Users, Loadouts, Agents, Weapons, Skins, Maps  
- Converted ERD → relational schema  
- Implemented primary keys, foreign keys, and constraints  
- Django models enforce referential integrity and domain rules

## ✔ Stage 2 — CRUD Functionality + API Development  
- Full REST API for all entities using Django REST Framework  
- User-specific loadouts with authentication  
- Create, Read, Update, Delete loadouts  
- React UI for:
  - Creating loadouts  
  - Editing loadouts  
  - Deleting loadouts  
  - Viewing all loadouts  
- Visual UI components with reusable cards, tables, and forms

## ✔ Stage 3 — SQL Injection Protection, Indexes, Transactions  
### 🔒 SQL Injection Protection  
- All backend queries use **Django ORM**, which parameterizes queries internally  
- No raw SQL concatenation  
- Axios + CSRF cookies used on frontend  
- Example of unsafe SQL (commented out) and corrected ORM version

### ⚡ Database Indexes  
Indexes added in `Loadout` model:

```python
class Meta:
    indexes = [
        models.Index(fields=["user"]),
        models.Index(fields=["map"]),
        models.Index(fields=["agent", "user"]),
    ]

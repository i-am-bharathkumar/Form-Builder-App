
# Dynamic Form Builder – React + TypeScript + Redux + MUI

A production-ready **Dynamic Form Builder** application built with **React**, **TypeScript**, **Vite**, **Redux Toolkit**, and **Material-UI**, as part of the upliance.ai Associate Software Developer assignment.

## 🚀 Live Demo
[View Live App](https://form-builder-webapp.netlify.app/)

---

## 📌 Features

### **Form Builder (/create)**
- Add, edit, delete, and reorder fields dynamically.
- Supported field types:
  - Text
  - Number
  - Textarea
  - Select
  - Radio
  - Checkbox
  - Date
- Field configuration:
  - Label
  - Required toggle
  - Default value
  - Validation rules:
    - Required
    - Minimum/Maximum length
    - Email format
    - Custom password rule (min 8 chars, must contain a number)
- **Derived fields**:
  - Select one or more parent fields
  - Define a formula for computation
  - Auto-updates based on parent field values
- Save forms with a custom name to **localStorage**.

### **Preview (/preview)**
- Renders the form as it would appear to the end user.
- Full validation handling with error messages.
- Derived fields update live as parent values change.

### **My Forms (/myforms)**
- Displays all saved forms from **localStorage**.
- Shows form name and creation date.
- Clicking a saved form loads it into the preview page.

---

## 🛠️ Tech Stack
- **React** (UI)
- **TypeScript** (type safety)
- **Redux Toolkit** (state management)
- **Material-UI** (UI components)
- **Vite** (bundler)
- **Day.js** (date manipulation)
- **UUID** (unique IDs for fields)

---

## 📂 Project Structure
```

src/
components/
hooks/
pages/
store/
types/
utils/
App.tsx
index.tsx

````

---

## ⚙️ Installation & Running Locally

1. **Clone the repository**
```bash
git clone <https://github.com/i-am-bharathkumar/Form-Builder-App/>
cd form-builder-App
````

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

5. **Preview production build**

```bash
npm run preview
```

---

## 📌 Assignment Requirements Checklist

* [x] Create dynamic forms with customizable fields and validations
* [x] Preview forms with live validation
* [x] Manage multiple saved forms
* [x] Derived field functionality
* [x] Persist form schema in localStorage
* [x] TypeScript for type safety
* [x] Predictable Redux state management
* [x] Modular, maintainable architecture

---

## 📜 License

This project is licensed under the MIT License.

# Contributing to EduHaven

Thank you for your interest in contributing to **EduHaven** as part of **GirlScript Summer of Code (GSSoC) 2025**!
We’re excited to have you here and appreciate your time and effort to improve this project.

---

## 🚀 Code of Conduct

We expect all contributors to follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
Be respectful, helpful, and open to learning. This is a beginner-friendly project.

---

## 📋 Contribution Guidelines

### 1️⃣ Getting Started

* **Fork** this repository.

* **Clone** your forked repository locally:

  ```bash
  git clone https://github.com/your-username/EduHaven.git
  cd EduHaven
  ```

* **Set up** the project by running the commands:

  ```bash
  npm install
  npm run dev
  ```

  Run these commands separately inside both directories:

  * [`Client`](./Client) → frontend
  * [`Server`](./Server) → backend

* **Create `.env` files** in both folders using the provided `.env.example` files.

---

### 2️⃣ Working on Issues

* Pick an issue from the [Issues](https://github.com/EduHaven/EduHaven/issues) section.
* Look for beginner-friendly labels such as:

  * `good first issue`
  * `beginner friendly`
  * `documentation`
* **Comment on the issue to get assigned** before starting work (mandatory for GSSoC tracking).

---

### 3️⃣ Creating a Feature or Fix Branch

* Always pull the latest `main` branch before starting:

  ```bash
  git checkout main
  git pull origin main
  ```
* Create a new branch for your feature or fix:

  ```bash
  git checkout -b feature/your-feature-name
  ```

---

### 4️⃣ Writing Your Code

✅ Follow the existing **code style and folder structure**.
✅ Write **clear and meaningful commit messages**, for example:

```bash
git commit -m "Fix: correct navbar overflow on mobile"
```

✅ Add **screenshots** in your Pull Request if your change affects the UI.

---

### 5️⃣ Submitting a Pull Request

* Push your branch to your fork:

  ```bash
  git push origin feature/your-feature-name
  ```
* Open a **Pull Request to the `dev` branch** of this repository (not `main`).
* Fill out the PR description properly and link the related Issue.

---

### 6️⃣ Code Review & Merging

* One or more maintainers will review your PR.
* You may be asked to make changes—this is normal and part of the process.
* Once approved, your PR will be merged into the project.

---

## 🏷 Labels You’ll See

| Label              | Meaning                             |
| ------------------ | ----------------------------------- |
| `good first issue` | Beginner-friendly issues            |
| `bug`              | Something isn’t working as expected |
| `enhancement`      | New feature or improvement          |
| `UI`               | Design or frontend-related change   |
| `needs discussion` | Requires further clarification      |

---

## 🙌 Tips for a Great Contribution

* Keep PRs **small and focused**—one fix or feature per PR.
* Add clear **before/after screenshots** for any UI changes.
* Be polite, patient, and open to feedback.

---

## ❓ Need Help?

* Ask in the **GSSoC Discord** or discussion forums.
* Open an **Issue** in this repo if you're stuck.

---

Thank you for being part of **EduHaven** 🙌
Let’s build something awesome together!

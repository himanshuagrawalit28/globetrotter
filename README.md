# 🌍 GlobeTrotter

> **Dream. Plan. Explore. Share.**

GlobeTrotter is a personalized travel planning platform designed to make multi-city trip planning simple, interactive, and organized.

Instead of managing destinations, dates, activities, and expenses across multiple apps, GlobeTrotter brings everything together in one place. Users can create customized trips, build day-wise itineraries, discover cities and activities, track estimated expenses, visualize their journey, and share their travel plans with others.

---

## 🚀 Why GlobeTrotter?

Planning a multi-city trip can quickly become complicated.

Travelers often need to manage:

* Multiple destinations
* Different travel dates
* Activities and attractions
* Transportation
* Accommodation
* Food expenses
* Daily budgets
* Itinerary changes
* Sharing plans with friends

GlobeTrotter solves this problem by providing a **single, structured workspace for the complete travel-planning process**.

### Our Vision

To transform travel planning from a complicated task into an enjoyable and intelligent experience where travelers can **dream, design, optimize, visualize, and share their journeys**.

---

## ✨ Key Features

### 🔐 Authentication

Users can securely create and access their GlobeTrotter accounts.

* Login
* Signup
* Forgot password
* Basic form validation
* Personalized user experience

---

### 🏠 Personalized Dashboard

The dashboard acts as the central hub for the user's travel plans.

Users can:

* View upcoming trips
* Access recently created trips
* Start planning a new trip
* Discover popular destinations
* View budget highlights
* Quickly navigate to their itineraries

---

### 🗺️ Create Customized Trips

Users can create a trip by specifying:

* Trip name
* Start date
* End date
* Trip description
* Optional cover image

Each trip becomes a dedicated workspace where destinations, activities, and expenses can be organized.

---

### 🏙️ Multi-City Itinerary Builder

The core of GlobeTrotter is its interactive itinerary builder.

Users can:

* Add multiple cities/stops
* Assign dates to each destination
* Add activities
* Organize activities day-wise
* Reorder destinations
* Modify travel plans
* View the complete journey in one place

This allows travelers to build highly personalized multi-city journeys instead of following fixed travel packages.

---

### 🔎 City Discovery

Users can search for cities and discover useful information before adding them to their itinerary.

City information can include:

* Country
* Region
* Popularity
* Estimated cost index
* Destination information

Users can directly add a selected city to their trip.

---

### 🎯 Activity Discovery

Travelers can discover activities based on their interests and budget.

Activities can be filtered by:

* Category
* Cost
* Duration
* Interest/type

Each activity can provide useful information such as:

* Description
* Estimated cost
* Duration
* Images
* Category

Users can add activities directly to specific itinerary stops.

---

### 💰 Smart Trip Budget

GlobeTrotter provides an estimated financial overview of the complete trip.

Expenses can be categorized into:

* 🚗 Transportation
* 🏨 Accommodation
* 🍽️ Food
* 🎟️ Activities
* 💳 Other expenses

Users can view:

* Total estimated cost
* Cost per day
* Cost by category
* Day-wise expenses
* Budget utilization
* Over-budget alerts

This helps travelers make better financial decisions while planning.

---

### 📅 Calendar & Timeline

Travel plans can be visualized through an intuitive timeline/calendar interface.

Users can see:

* Travel dates
* Cities
* Daily activities
* Activity timings
* Estimated costs
* Journey progression

The visual timeline makes complex multi-city trips easier to understand at a glance.

---

### 🔗 Shareable Itineraries

Users can share their travel plans with friends or the public.

Each public itinerary can provide:

* Trip overview
* Destination list
* Day-wise itinerary
* Activities
* Estimated budget
* Travel timeline

A unique public URL allows others to view the itinerary without modifying the original trip.

Users can also **copy an existing public itinerary** and customize it for their own trip.

---

### 👤 User Profile & Preferences

Users can manage their personal information and travel preferences.

Possible settings include:

* Name
* Profile picture
* Email
* Language preference
* Saved destinations
* Privacy settings
* Account deletion

---

## 🧠 Intelligent Travel Planning

GlobeTrotter is designed to go beyond basic itinerary management.

The platform can intelligently assist users by considering:

* Trip duration
* Number of destinations
* Available budget
* Activity preferences
* Estimated destination costs
* Daily schedules

For example:

> **"Plan a 7-day trip across Jaipur, Delhi and Agra under ₹50,000."**

GlobeTrotter can help structure the journey, distribute time across destinations, suggest activities, and estimate the overall cost.

---

## 🏗️ System Architecture

GlobeTrotter follows a modular architecture consisting of:

```text
                    ┌──────────────────────┐
                    │       Frontend       │
                    │  Web / Responsive UI │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Backend API     │
                    │ Authentication       │
                    │ Trips & Itineraries  │
                    │ Activities           │
                    │ Budget Calculation   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Relational Database │
                    │ Users                │
                    │ Trips                │
                    │ Stops                │
                    │ Activities           │
                    │ Expenses             │
                    └──────────────────────┘
```

The relational database allows complex relationships between users, trips, destinations, activities, schedules, and expenses to be stored and retrieved efficiently.

---

## 🗄️ Core Data Model

The primary entities in GlobeTrotter include:

```text
User
 │
 └── Trips
      │
      ├── Stops
      │    │
      │    └── Activities
      │
      ├── Expenses
      │
      └── Itinerary
```

### Main Entities

| Entity          | Purpose                                      |
| --------------- | -------------------------------------------- |
| Users           | Stores user accounts and profile information |
| Trips           | Stores individual travel plans               |
| Stops           | Stores cities/destinations within a trip     |
| Activities      | Stores things to do at each destination      |
| Itinerary Items | Stores day/time-specific plans               |
| Expenses        | Stores estimated travel costs                |
| Shared Trips    | Handles public/shared itinerary access       |

---

## 📱 Application Flow

```text
Signup / Login
      ↓
   Dashboard
      ↓
  Create Trip
      ↓
 Add Destinations
      ↓
 Add Activities
      ↓
 Build Itinerary
      ↓
 Calculate Budget
      ↓
 View Timeline / Calendar
      ↓
 Share Trip
```

---

## 🎯 Core User Journey

A typical GlobeTrotter workflow looks like this:

### 1. Create an account

The traveler signs up or logs into GlobeTrotter.

### 2. Create a trip

The user enters the trip name, travel dates, and description.

### 3. Select destinations

Cities are searched and added as stops in the journey.

### 4. Plan activities

Activities are selected for each destination.

### 5. Build the itinerary

The user organizes cities and activities into a day-wise schedule.

### 6. Review the budget

GlobeTrotter calculates estimated costs across different categories.

### 7. Visualize the journey

The complete trip is displayed through a calendar or timeline.

### 8. Share the trip

The user can generate a public itinerary link and share it with friends or the travel community.

---

## 📊 Budget Calculation

GlobeTrotter calculates the estimated trip cost using multiple expense categories.

```text
Total Trip Cost
│
├── Transportation
├── Accommodation
├── Food
├── Activities
└── Other Expenses
```

Users can compare their estimated spending against their planned budget.

### Example

```text
Trip Budget:        ₹50,000

Transportation:    ₹10,000
Accommodation:     ₹18,000
Activities:         ₹ 8,000
Food:               ₹ 7,000
Other:              ₹ 2,000
────────────────────────────
Estimated Total:    ₹45,000

Remaining Budget:   ₹ 5,000
```

---

## 🌟 What Makes GlobeTrotter Different?

GlobeTrotter combines several travel-planning capabilities into one platform.

### Instead of:

```text
Google → Search destinations
Notes → Write itinerary
Spreadsheet → Track expenses
Calendar → Manage dates
Chat → Share plans
```

### GlobeTrotter provides:

```text
          🌍 GlobeTrotter
                │
      ┌─────────┼─────────┐
      ↓         ↓         ↓
   Explore    Plan     Budget
      │         │         │
      └─────────┼─────────┘
                ↓
            Visualize
                ↓
              Share
```

The goal is to make the **entire planning journey available in one connected experience**.

---

## 📌 Planned Screens

GlobeTrotter includes the following major screens:

1. Login / Signup
2. Dashboard
3. Create Trip
4. My Trips
5. Itinerary Builder
6. Itinerary View
7. City Search
8. Activity Search
9. Trip Budget & Cost Breakdown
10. Trip Calendar / Timeline
11. Shared/Public Itinerary
12. User Profile & Settings
13. Admin Analytics Dashboard *(optional)*

---

## 🛠️ Technology Stack

> Update this section according to the technologies used by the team.

### Frontend

* React / Next.js
* Responsive UI
* Component-based architecture
* Interactive calendar/timeline
* Data visualization

### Backend

* Node.js
* Express.js / API layer
* RESTful APIs
* Authentication & authorization

### Database

* Relational SQL database
* Structured relationships between users, trips, stops, activities and expenses

### Additional Services

Depending on implementation:

* Image storage
* Maps/location APIs
* Destination/activity APIs
* Authentication services
* AI/LLM services

---

## 🔌 API Modules

The backend can be organized around the following API modules:

```text
/auth
/users
/trips
/stops
/cities
/activities
/itinerary
/expenses
/budget
/shared-trips
```

Example operations:

```text
POST   /trips
GET    /trips
GET    /trips/:id
PUT    /trips/:id
DELETE /trips/:id

POST   /trips/:id/stops
PUT    /stops/:id
DELETE /stops/:id

POST   /stops/:id/activities

GET    /cities/search
GET    /activities/search

GET    /trips/:id/budget

POST   /trips/:id/share
GET    /shared/:shareId
```

---

## 🔐 Security

GlobeTrotter is designed with user privacy and data protection in mind.

Security considerations include:

* Secure authentication
* Password hashing
* Protected APIs
* Authorization checks
* User-specific trip access
* Public/private itinerary controls
* Input validation
* Secure handling of uploaded images

---

## 📱 Responsive Design

GlobeTrotter is designed to work across:

* 💻 Desktop
* 📱 Mobile
* 📲 Tablet

The interface adapts to different screen sizes so travelers can plan their journeys from anywhere.

---

## 🚀 Future Scope

GlobeTrotter can be extended with more intelligent travel capabilities.

### 🤖 AI Travel Assistant

Users could describe their requirements in natural language:

> "I have ₹60,000, 6 days, and I love history and food. Plan a trip for me."

The AI assistant could generate an initial itinerary that users can edit.

### 🗺️ Interactive Maps

Show destinations and activities on an interactive map with route visualization.

### 🌦️ Weather-Aware Planning

Use weather information to recommend suitable activities and automatically adjust plans.

### 🚆 Transport Optimization

Suggest efficient transportation options between cities.

### 👥 Collaborative Planning

Allow multiple users to edit the same itinerary in real time.

### 📈 Personalized Recommendations

Learn from user preferences to recommend destinations and activities.

### 🌐 Travel Community

Users could publish itineraries, discover trips created by others, and reuse or customize them.

---

## 🏆 Hackathon Goal

GlobeTrotter aims to demonstrate how a well-designed relational data model combined with an intuitive user experience can simplify complex multi-city travel planning.

Our focus is not just on creating another travel website, but on building a **complete digital travel-planning workspace** where users can:

> **Dream → Discover → Plan → Optimize → Visualize → Share**

---

## 👥 Team

Built with ❤️ by the **GlobeTrotter Hackathon Team**.

---

## 📄 License

This project is developed as part of a hackathon and is intended for educational and demonstration purposes.

# Zylo Mobile App - Frontend Updates & Changes

## Overview
This document outlines all frontend updates, new features, and changes made to the Zylo Mobile App, focusing on the errander experience and role-based navigation.

---

## Table of Contents
1. [Navigation Structure](#navigation-structure)
2. [Role-Based UI System](#role-based-ui-system)
3. [Pages & Screens](#pages--screens)
4. [New Features](#new-features)
5. [UI Components](#ui-components)
6. [User Flows](#user-flows)

---

## Navigation Structure

### Architecture
- **Primary Navigation**: Drawer (Hamburger Menu)
- **Secondary Navigation**: Bottom Tabs (Role-dependent)
- **Implementation**: Expo Router with file-based routing

### File Structure
```
app/
  dashboard/
    _layout.tsx           # Drawer Navigator (wraps everything)
    (tabs)/
      _layout.tsx         # Tab Navigator (role-based)
      index.tsx          # Sender Home (Create Errands)
      browse.tsx         # Errander Home (Browse Errands)
      active.tsx         # Active Errands (Erranders only)
      history.tsx        # Errand History (Both roles)
      account.tsx        # Account & Profile (Both roles)
    payment.tsx          # Payment Settings
    safety.tsx           # Safety & Security
    support.tsx          # Help & Support
    about.tsx            # About Zylo
```

---

## Role-Based UI System

### User Roles
1. **Sender** - Posts errands for others to complete
2. **Errander** - Accepts and completes errands for payment
3. **Both** - Can both post and accept errands

### Default Pages by Role

| Role | Default Landing Page | Available Tabs |
|------|---------------------|----------------|
| **Sender** | `index.tsx` (Home - Create Errands) | Home, History, Account |
| **Errander** | `browse.tsx` (Browse Errands) | Browse, Active, History, Account |
| **Both** | `browse.tsx` (Browse Errands) | Home, Browse, Active, History, Account |

### Role Detection Logic
```typescript
const isErrander = user?.role === "errander" || user?.role === "both";
const isSender = user?.role === "sender" || user?.role === "both";
```

### Tab Visibility Rules
- **Home Tab** (`index.tsx`) - Only visible when `isSender === true`
- **Browse Tab** (`browse.tsx`) - Only visible when `isErrander === true`
- **Active Tab** (`active.tsx`) - Only visible when `isErrander === true`
- **History Tab** (`history.tsx`) - Always visible (both roles)
- **Account Tab** (`account.tsx`) - Always visible (both roles)

---

## Pages & Screens

### 1. Sender Home (`index.tsx`)
**Purpose**: Create and post new errands

**Access**: Senders and "Both" role only

**Features**:
- Quick errand creation
- Category selection
- Workmanship and item cost input
- Location picker
- Default page for sender-only users

---

### 2. Browse Errands (`browse.tsx`) ⭐ **DEFAULT FOR ERRANDERS**
**Purpose**: Discover and accept available errands

**Access**: Erranders and "Both" role only

**Layout**: Map-first with bottom sheet feed

**Features**:
- **Interactive Map**
  - Real-time errand markers showing workmanship amounts
  - User location marker
  - Click markers to view errand details
  - Custom map tiles (Stadia Maps) with theme support

- **Bottom Sheet (3 Fixed Heights)**
  - 30% - Collapsed preview
  - 60% - Medium (when errand selected)
  - 90% - Full view (when "View More" clicked)
  - Fixed snap points (no over-dragging)
  - Scrollable content within each height

- **Errand Feed**
  - Filterable list of available errands
  - Category badges with color coding
  - Distance from user location
  - Workmanship amount display
  - Sender ratings and tier badges
  - Urgency indicators
  - Real-time view count

- **Category Filter**
  - Horizontal scrollable chips
  - Categories: All, Fuel & Energy, Shopping & Groceries, Courier & Delivery, Banking & Payments, Queue Standing, Custom Errand
  - Instant filtering

- **Price Filter**
  - 4 preset ranges:
    - All (₦0 - ₦10,000)
    - Under ₦1.5k
    - ₦1.5k - ₦2.5k
    - Above ₦2.5k
  - Combines with category filter

- **Smart List Behavior**
  - Click map marker → Errand moves to top of list
  - Initially shows only selected errand
  - "View More" button to expand full list
  - Clicking "View More" increases bottom sheet to 90%
  - Empty state with "Clear Filters" option

- **Errand Cards**
  - Title and category
  - Pickup and destination addresses
  - Distance indicator
  - Workmanship and item cost
  - Sender info with tier badge
  - 3 action buttons:
    - Decline (X)
    - Counter Offer
    - Accept

- **Real-time Notifications**
  - Animated notification banner for new errands
  - Slides down from top after 3 seconds
  - Pulse animation on icon
  - Auto-dismisses after 8 seconds
  - "View Errand" action
  - Only shows for erranders
  - Simulates live errand incoming

- **Counter Offer System**
  - Full-screen modal
  - Shows original workmanship amount
  - Numeric input for counter amount
  - Validation (must be less than original)
  - Optional message field
  - Keyboard avoiding view
  - Tap outside to dismiss keyboard
  - Success confirmation

**Code Location**: `app/dashboard/(tabs)/browse.tsx`

---

### 3. Active Errands (`active.tsx`)
**Purpose**: Track currently assigned/in-progress errands

**Access**: Erranders and "Both" role only

**Features**:
- Status tracking (Assigned, In Progress, Awaiting Confirmation)
- Route visualization (pickup → destination)
- Earnings preview
- Sender contact info
- Quick actions:
  - Chat with sender
  - Navigate to location
  - Call sender
  - Mark as complete
- Time tracking (accepted time, estimated completion)
- Empty state with browse CTA

**Status Types**:
```typescript
assigned: {
  color: '#2196F3',
  label: 'Assigned',
  description: 'Head to pickup location'
},
in_progress: {
  color: '#FF9800',
  label: 'In Progress',
  description: 'Complete the errand'
},
awaiting_confirmation: {
  color: '#9C27B0',
  label: 'Awaiting Confirmation',
  description: 'Waiting for sender to verify'
}
```

**Code Location**: `app/dashboard/(tabs)/active.tsx`

---

### 4. History (`history.tsx`)
**Purpose**: View completed errands and earnings

**Access**: Both roles (content varies by role)

**Features**:

**For Erranders**:
- Earnings Summary Card
  - Period selector (Today, This Week, This Month)
  - Large earnings display
  - Total errands completed
  - Average rating

- Completed Errands List
  - Errand title and category
  - Completion timestamp
  - Earnings breakdown:
    - Workmanship fee
    - Platform fee deduction
    - Net earnings
  - Sender info and rating
  - Your rating given

**For Senders**:
- Posted errands history
- Status of each errand
- Assigned errander info

**Code Location**: `app/dashboard/(tabs)/history.tsx`

---

### 5. Account (`account.tsx`)
**Purpose**: Profile management and tier progression

**Access**: Both roles

**Features**:

**Profile Section**:
- Avatar placeholder
- User name and email
- Role/tier badge

**For Erranders - Tier System**:
- 4-Tier Gamification:
  - 🔵 Tier 1: Starter
  - 🟢 Tier 2: Trusted
  - 🟡 Tier 3: Verified
  - ⭐ Tier 4: Elite

- Stats Display:
  - Errands completed
  - Average rating
  - Completion rate

- Tier Progress Card (if not max tier):
  - Visual progress bar
  - Requirements checklist:
    - Complete X errands
    - Maintain X+ star rating
    - Complete KYC verification
  - Benefits preview for next tier
  - Next tier badge

- Errander Settings:
  - Bank Account
  - Payout History
  - KYC Documents

**General Settings** (All roles):
- Edit Profile
- Notifications
- Privacy & Security
- Logout

**Code Location**: `app/dashboard/(tabs)/account.tsx`

---

### 6. Drawer Menu (`_layout.tsx`)
**Features**:
- User profile summary
- Current role badge

**Role Toggle (DEV MODE)**:
- Switch between Sender/Errander/Both
- Instant UI updates
- Visual checkmarks for active role

**Theme Selector**:
- Light Mode
- Dark Mode
- System preference support

**Additional Menu Items**:
- Payment
- Safety
- Support
- About

**Code Location**: `app/dashboard/_layout.tsx`

---

## New Features

### 1. Counter Offer System ✨

**Location**: Browse Errands page

**Flow**:
1. Errander clicks "Counter" button on errand card
2. Modal slides up with errand details
3. Enter desired counter offer amount
4. Optionally add explanation message
5. Submit or cancel

**Implementation**:
- Full-screen bottom modal
- Keyboard avoiding view
- Platform-specific keyboard behavior (iOS/Android)
- Tap outside inputs to dismiss keyboard
- Scrollable content
- Input validation:
  - Must be numeric
  - Must be less than original amount
  - Shows error alerts for invalid input
- Success confirmation dialog
- API-ready structure

**Technical Details**:
```typescript
// Modal state
const [counterOfferModal, setCounterOfferModal] = useState(false);
const [counterOfferErrand, setCounterOfferErrand] = useState(null);
const [counterOfferAmount, setCounterOfferAmount] = useState('');
const [counterOfferMessage, setCounterOfferMessage] = useState('');

// Validation
if (amount >= counterOfferErrand.workmanship) {
  Alert.alert('Invalid Counter Offer',
    'Your counter offer should be less than the original workmanship amount');
  return;
}
```

**Code**: `browse.tsx:134-184, 393-493, 947-1055`

---

### 2. Real-Time Errand Notifications 🔔

**Location**: Browse Errands page

**Trigger**:
- Automatically appears 3 seconds after switching to errander role
- Simulates new errand coming in

**Features**:
- Animated banner slides down from top
- Pulse animation on icon for attention
- Shows errand preview:
  - Title
  - Category
  - Workmanship amount
  - Distance from user
- Auto-dismisses after 8 seconds
- Quick actions:
  - "View Errand" - Selects errand on map and in list
  - Dismiss button
- Only shows for erranders/both roles

**Animation Details**:
```typescript
// Slide in animation
Animated.spring(slideAnim, {
  toValue: 0,
  tension: 50,
  friction: 7,
});

// Pulse animation (loops)
Animated.loop(
  Animated.sequence([
    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000 }),
    Animated.timing(pulseAnim, { toValue: 1, duration: 1000 }),
  ])
);
```

**Component**: `components/ErrandNotificationBanner.tsx`

**Integration**: `browse.tsx:98-124, 381-387, 159-175`

---

### 3. Smart Map-to-List Synchronization 🗺️

**Location**: Browse Errands page

**Behavior**:
1. Click errand marker on map
2. Errand automatically becomes first in bottom sheet list
3. Bottom sheet expands to 60%
4. List collapses to show only selected errand
5. "View More" button appears
6. Click "View More" → Bottom sheet expands to 90%, shows all errands

**Benefits**:
- Reduces cognitive load
- Focuses attention on selected errand
- Progressive disclosure of information
- Smooth transitions

**Code**: `browse.tsx:137-152, 154-157, 469-479`

---

### 4. Dual Filter System 🔍

**Location**: Browse Errands page

**Category Filter**:
- Horizontal scrollable chips
- 6 categories + "All" option
- Color-coded badges
- Instant filtering

**Price Range Filter**:
- 4 preset ranges
- Quick selection buttons
- Works in combination with category filter

**Smart Filtering**:
```typescript
const filteredErrands = useMemo(() => {
  return errandOrder.filter((errand) => {
    const matchesCategory = selectedCategory === 'all' ||
      errand.category === selectedCategory;
    const matchesPrice = errand.workmanship >= priceRange.min &&
      errand.workmanship <= priceRange.max;
    return matchesCategory && matchesPrice;
  });
}, [errandOrder, selectedCategory, priceRange]);
```

**Empty State**:
- Shows when no errands match filters
- "Clear Filters" button to reset

**Code**: `browse.tsx:98-106, 346-461, 482-498`

---

### 5. Tier System Gamification 🎮

**Location**: Account page

**4-Tier Structure**:

| Tier | Badge | Name | Benefits |
|------|-------|------|----------|
| 1 | 🔵 | Starter | Basic access |
| 2 | 🟢 | Trusted | Higher advance limit |
| 3 | 🟡 | Verified | Same-day payout, Corporate errands |
| 4 | ⭐ | Elite | Premium benefits, Priority support |

**Progress Tracking**:
- Visual progress bar
- Requirements checklist with status icons
- Benefits preview for next tier
- Automatic tier badge display

**Requirements Example** (Tier 2 → Tier 3):
- Complete 60 errands
- Maintain 4.2+ star rating
- Complete KYC verification

**Code**: `account.tsx:24-38, 93-169`

---

### 6. Fixed Bottom Sheet Behavior ⚓

**Problem Solved**: Bottom sheet was too flexible, adjusting on every tap/drag

**Solution**:
- 3 fixed snap points (30%, 60%, 90%)
- No over-dragging beyond snap points
- Cannot be closed by dragging down
- Smooth animations between heights
- Content scrolls within fixed height

**Configuration**:
```typescript
<BottomSheet
  snapPoints={['30%', '60%', '90%']}
  enableOverDrag={false}
  enablePanDownToClose={false}
  animateOnMount={true}
/>
```

**Code**: `browse.tsx:544-554`

---

## UI Components

### 1. ErrandNotificationBanner
**File**: `components/ErrandNotificationBanner.tsx`

**Purpose**: Real-time notification for new errands

**Props**:
```typescript
interface ErrandNotificationProps {
  errand: {
    id: string;
    title: string;
    category: string;
    workmanship: number;
    distance: number;
  };
  onView: () => void;
  onDismiss: () => void;
}
```

**Features**:
- Slide-in animation
- Pulse animation on icon
- Auto-dismiss timer
- Theme support
- Responsive layout

---

### 2. Counter Offer Modal
**File**: Integrated in `browse.tsx`

**Features**:
- Bottom sheet modal
- Keyboard avoiding view
- Input validation
- Success/error alerts
- Theme support
- Scrollable content

---

### 3. Tier Badge Component
**Location**: Inline in `account.tsx` and `browse.tsx`

**Variants**:
- Profile display (large)
- Sender info (small)
- Next tier preview

**Dynamic Styling**:
```typescript
const TIER_CONFIG = {
  1: { emoji: '🔵', name: 'Starter', color: '#2196F3' },
  2: { emoji: '🟢', name: 'Trusted', color: '#4CAF50' },
  3: { emoji: '🟡', name: 'Verified', color: '#FFC107' },
  4: { emoji: '⭐', name: 'Elite', color: '#FF9800' },
};
```

---

## User Flows

### Errander Journey

#### 1. First Login (Errander Role)
```
Login → Browse Page (Default)
  ↓
Wait 3 seconds → Notification banner appears
  ↓
Click "View Errand" → Errand selected on map and list
  ↓
Review errand details → Choose action:
  - Accept directly
  - Counter offer
  - Decline
```

#### 2. Browse & Filter Errands
```
Browse Page → See all errands on map
  ↓
Apply filters:
  - Select category (e.g., "Shopping & Groceries")
  - Select price range (e.g., "₦1.5k - ₦2.5k")
  ↓
View filtered results → Click errand marker
  ↓
Review details → Accept or Counter
```

#### 3. Counter Offer Flow
```
Click "Counter" button → Modal opens
  ↓
Enter counter amount (e.g., ₦1,500 instead of ₦2,000)
  ↓
Add message: "I can do this for ₦1,500 because..."
  ↓
Click "Send Offer" → Validation → Success alert
  ↓
Wait for sender response (shown in Active tab if accepted)
```

#### 4. Active Errand Management
```
Accept errand → Appears in Active tab
  ↓
Status: "Assigned" → Navigate to pickup
  ↓
Click "Navigate" → Opens maps app
  ↓
Arrive at pickup → Status: "In Progress"
  ↓
Complete errand → Click "Complete"
  ↓
Status: "Awaiting Confirmation"
  ↓
Sender confirms → Moves to History tab
```

#### 5. Track Earnings
```
History tab → Select period (Today/Week/Month)
  ↓
View earnings summary → ₦4,600 this week
  ↓
Scroll to see completed errands
  ↓
Each card shows:
  - Workmanship: ₦2,000
  - Platform fee: -₦300
  - Net earned: ₦1,700
```

#### 6. Tier Progression
```
Account tab → View current tier (🟢 Trusted)
  ↓
See progress: 45/60 errands (75%)
  ↓
Check requirements:
  ✅ Complete 60 errands (45/60)
  ✅ Maintain 4.2+ rating (4.8 ✓)
  ❌ Complete KYC verification
  ↓
Complete KYC → Click "KYC Documents"
  ↓
Reach 60 errands → Auto-upgrade to 🟡 Verified
```

---

### Sender Journey

#### 1. First Login (Sender Role)
```
Login → Home Page (Default)
  ↓
See "Create Errand" interface
  ↓
Fill errand details → Post errand
  ↓
Monitor in History tab
```

#### 2. Role Switching (Testing)
```
Open drawer → Role Toggle (DEV MODE)
  ↓
Select "Errander" role
  ↓
Tabs update: Browse, Active, History, Account
  ↓
Browse page becomes default
  ↓
After 3 seconds → Notification appears
```

---

## Theme Support

### Light Mode
- Background: `#FFFFFF`
- Surface: `#F5F5F5`
- Primary: `#6200EE`
- Text: `#000000`

### Dark Mode
- Background: `#121212`
- Surface: `#1E1E1E`
- Primary: `#BB86FC`
- Text: `#FFFFFF`

### Theme Context
- Located: `contexts/ThemeContext.tsx`
- Provides: `colors`, `theme`, `setTheme`
- All components use theme colors
- Instant switching with no reload

---

## Mock Data Structure

### Errand Object
```typescript
{
  id: string;
  title: string;
  category: 'Fuel & Energy' | 'Shopping & Groceries' | 'Courier & Delivery' |
    'Banking & Payments' | 'Queue Standing' | 'Custom Errand';
  workmanship: number;
  itemCost: number;
  distance: number;
  pickup: { latitude, longitude, address };
  destination: { latitude, longitude, address };
  sender: { name, rating, tier };
  views: number;
  urgency: 'normal' | 'urgent';
  createdAt: string;
}
```

### User Object
```typescript
{
  id: string;
  full_name: string;
  email: string;
  role: 'sender' | 'errander' | 'both';
}
```

### Errander Data Object
```typescript
{
  tier: 1 | 2 | 3 | 4;
  errandsCompleted: number;
  averageRating: number;
  completionRate: number;
  totalEarnings: number;
  dailyFee: number;
  advanceLimit: number;
  nextTier: {
    tier: number;
    errandsRequired: number;
    ratingRequired: number;
    benefits: string[];
  };
}
```

---

## Technical Stack

### Core
- **React Native**: Mobile app framework
- **Expo**: Development platform
- **TypeScript**: Type safety

### Navigation
- **Expo Router**: File-based routing
- **React Navigation**: Drawer and Tabs

### UI Libraries
- **@gorhom/bottom-sheet**: Bottom sheet component
- **react-native-maps**: Map integration
- **@expo/vector-icons**: Icon library (Ionicons)

### Map Provider
- **Stadia Maps**: Custom map tiles with theme support

### State Management
- **React Context**: Theme and Auth contexts
- **React Hooks**: useState, useEffect, useMemo, useRef

---

## Performance Optimizations

1. **useMemo for Filtered Errands**: Prevents unnecessary recalculations
2. **useRef for Map and Bottom Sheet**: Direct access without re-renders
3. **Lazy Loading**: Components load only when needed
4. **Fixed Bottom Sheet Heights**: Prevents layout thrashing
5. **Animated Values**: Use native driver for smooth animations

---

## Accessibility Features

1. **Color Contrast**: All text meets WCAG AA standards
2. **Touch Targets**: All buttons minimum 44x44pt
3. **Keyboard Handling**: Proper keyboard avoiding and dismissal
4. **Screen Reader Support**: Semantic labels on interactive elements
5. **Visual Feedback**: Clear states for all interactions

---

## Future Enhancements

### Planned Features
1. WebSocket for real-time notifications
2. Push notifications integration
3. In-app chat system
4. Payment gateway integration
5. KYC document upload
6. Advanced filtering (by distance, rating, etc.)
7. Errand routing optimization
8. Offline mode support

### API Integration Points
- `handleAcceptErrand` → POST /api/errands/:id/accept
- `submitCounterOffer` → POST /api/errands/:id/counter-offer
- `handleCompleteErrand` → PUT /api/errands/:id/complete
- Real-time errand feed → WebSocket connection
- User tier updates → GET /api/users/me/tier

---

## Testing Checklist

### Role Switching
- [ ] Switch to Sender → See Home tab only (+ History, Account)
- [ ] Switch to Errander → See Browse tab only (+ Active, History, Account)
- [ ] Switch to Both → See all tabs

### Browse Page
- [ ] Map loads with errand markers
- [ ] Click marker → Bottom sheet expands to 60%
- [ ] Selected errand appears first in list
- [ ] "View More" button shows when collapsed
- [ ] Click "View More" → Bottom sheet expands to 90%
- [ ] Category filter works
- [ ] Price filter works
- [ ] Combined filters work
- [ ] Empty state shows when no matches
- [ ] Clear filters button resets filters

### Notifications
- [ ] Switch to Errander → Notification appears after 3 seconds
- [ ] Notification slides down smoothly
- [ ] Icon pulses continuously
- [ ] Click "View Errand" → Errand selected
- [ ] Click dismiss → Notification disappears
- [ ] Auto-dismisses after 8 seconds

### Counter Offer
- [ ] Click "Counter" → Modal opens
- [ ] Tap outside input → Keyboard dismisses
- [ ] Enter amount higher than original → Shows error
- [ ] Enter valid amount → Submit succeeds
- [ ] Message field optional
- [ ] Modal scrolls when keyboard open

### Bottom Sheet
- [ ] Fixed at 30%, 60%, 90% only
- [ ] No over-dragging beyond snap points
- [ ] Content scrolls within fixed height
- [ ] Cannot close by dragging down
- [ ] Smooth transitions between heights

### Theme
- [ ] Toggle light/dark mode → All screens update
- [ ] Colors correct in both themes
- [ ] No visual glitches during switch

---

## Known Issues

None currently reported.

---

## Version History

### v1.0.0 (Current)
- Initial role-based navigation system
- Browse errands with map and filters
- Counter offer system
- Real-time notifications
- Tier progression tracking
- Fixed bottom sheet behavior

---

## Contributors

- Frontend Development: Claude (AI Assistant)
- Product Vision: Edward Campbell
- Business Logic: Based on ZYLO_BUSINESS_MODEL.md and ZYLO_COMPLETE_SYSTEM.md

---

## Documentation References

- Business Model: `ZYLO_BUSINESS_MODEL.md`
- System Architecture: `ZYLO_COMPLETE_SYSTEM.md`
- Component Library: `components/`
- Contexts: `contexts/`

---

*Last Updated: 2026-02-23*

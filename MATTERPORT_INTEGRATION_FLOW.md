# Matterport Integration Flow & Platform Analysis

## 📍 Current State: Where Matterport is NOT Integrated

### ❌ **Problem: Matterport is Currently Disconnected from the Form**

**Current User Flow:**
```
Home → Consent → InputForm (7 steps) → Loading → Results
  └─> RoomScan (separate, not connected)
```

**What's Missing:**
- Matterport is in a **separate screen** (`RoomScan.jsx`)
- It's **not integrated** into the `InputForm` flow
- Users can't use Matterport data to **auto-fill** form fields
- Step 2 (Building Basics) still requires **manual input** of:
  - Floor Area (sq ft)
  - Ceiling Height (ft)
  - Window area percentage
  - Number of doors

## 🎯 Where Matterport SHOULD Be Integrated

### **Integration Point: Step 2 - Building Basics**

**File:** `src/components/forms/Step2Building.jsx`

**Current Implementation:**
- Users manually type floor area, ceiling height, etc.
- No connection to Matterport

**What Should Happen:**
1. User clicks "Scan Room with Matterport" button in Step 2
2. Opens Matterport viewer or redirects to Matterport Capture app
3. User creates/views scan
4. **Extract measurements** from Matterport scan
5. **Auto-fill** form fields:
   - Floor Area → from Matterport measurements
   - Ceiling Height → from Matterport measurements
   - Window Area → from Matterport scan analysis
   - Door Count → from Matterport scan analysis

## 🔄 Proposed Integration Flow

### **Option 1: Pre-Scan Flow (Recommended)**
```
Home → Consent → InputForm
  Step 1: Location ✓
  Step 2: Building Basics
    └─> [Button: "Scan Room with Matterport"]
        └─> Open Matterport Capture app (mobile) OR
        └─> Redirect to Matterport website (web)
        └─> User creates scan
        └─> Return to app with Model SID
        └─> Extract measurements via Matterport API
        └─> Auto-fill Step 2 fields
  Step 3-7: Continue with form...
```

### **Option 2: Post-Scan Flow**
```
Home → Consent → InputForm
  Step 1-7: Complete form manually
  Step 2: [Optional button: "Use Matterport Scan"]
    └─> If user has existing scan, use it
    └─> Override manual inputs with scan data
```

## 📱 Platform Considerations

### **Matterport Capture (Creating Scans)**

#### ✅ **Mobile-Only (iOS/Android)**
- **Matterport Capture app** is **mobile-only**
- Requires walking around with smartphone
- Uses phone's camera and sensors
- **Cannot be done on web/desktop**

#### ❌ **Web/Desktop**
- Cannot create scans on web
- Can only **view** existing scans

### **Matterport Viewer (Viewing Scans)**

#### ✅ **All Platforms**
- **Mobile (iOS/Android)**: Works via WebView ✅
- **Web**: Works via iframe (with fallback) ✅
- **Desktop**: Works via iframe ✅

### **Matterport Data Extraction**

#### ⚠️ **Platform Limitations**
- **SDK Measurements API**: Available on all platforms (via SDK)
- **REST API**: Available on all platforms (server-side)
- **Best Practice**: Extract data on **backend** using REST API

## 🔧 How to Extract Data from Matterport

### **Current Limitation:**
The Matterport SDK we integrated is for **VIEWING** scans, not extracting data.

### **To Extract Measurements, You Need:**

#### **Option 1: Matterport REST API** (Recommended)
```javascript
// Backend: Extract measurements from Matterport scan
// POST to Matterport API with Model SID
const response = await fetch(`https://api.matterport.com/api/v1/models/${modelSid}/measurements`, {
  headers: {
    'Authorization': `Bearer ${apiToken}`
  }
});

// Returns:
{
  floorArea: 2500,  // sq ft
  ceilingHeight: 9,  // ft
  roomDimensions: { width, height, depth },
  windowArea: 150,  // sq ft
  doorCount: 2
}
```

#### **Option 2: Matterport SDK Measurements API**
```javascript
// Frontend: Use SDK to get measurements
const mpSdk = await viewer.playingPromise;
const measurements = await mpSdk.Measure.getMeasurements();

// Extract:
const floorArea = measurements.floorArea;
const ceilingHeight = measurements.ceilingHeight;
```

## 🏗️ Implementation Plan

### **Step 1: Add Matterport Button to Step2Building**

**File:** `src/components/forms/Step2Building.jsx`

Add a button that:
- Opens Matterport Capture app (mobile) OR
- Redirects to Matterport website (web)
- Allows user to input Model SID if they have existing scan

### **Step 2: Create Backend API Endpoint**

**File:** `thermaliq-backend/routes/matterport.js` (new)

```javascript
// POST /api/matterport/extract-measurements
// Takes Model SID, returns measurements
router.post('/extract-measurements', async (req, res) => {
  const { modelSid } = req.body;
  
  // Call Matterport REST API
  const measurements = await getMatterportMeasurements(modelSid);
  
  // Return in format expected by frontend
  res.json({
    success: true,
    data: {
      floorArea: measurements.floorArea,
      ceilingHeight: measurements.ceilingHeight,
      windowAreaPercent: (measurements.windowArea / measurements.floorArea) * 100,
      doorCount: measurements.doorCount
    }
  });
});
```

### **Step 3: Update Step2Building to Auto-Fill**

```javascript
const handleMatterportScan = async (modelSid) => {
  // Call backend to extract measurements
  const response = await fetch('/api/matterport/extract-measurements', {
    method: 'POST',
    body: JSON.stringify({ modelSid })
  });
  
  const { data } = await response.json();
  
  // Auto-fill form
  setFormData({
    ...formData,
    floorArea: data.floorArea.toString(),
    ceilingHeight: data.ceilingHeight.toString(),
    windowAreaPercent: data.windowAreaPercent.toString(),
    numExteriorDoors: data.doorCount.toString()
  });
};
```

### **Step 4: Update Backend Calculation Service**

**File:** `thermaliq-backend/services/hvacCalculationService.js`

Already supports `roomData` parameter! ✅
```javascript
// Line 132-149: Already uses roomData if available
const effectiveFloorArea = roomData?.processedDimensions?.floorArea 
  ? roomData.processedDimensions.floorArea 
  : floorArea;
```

## 📋 Complete Integration Flow

### **Mobile (iOS/Android) - Full Flow:**

1. **User starts form** → Step 2: Building Basics
2. **Clicks "Scan Room"** → Opens Matterport Capture app
3. **User scans room** → Walks around, captures 360° images
4. **Scan completes** → Gets Model SID
5. **Returns to app** → Model SID passed back
6. **App calls backend** → `/api/matterport/extract-measurements`
7. **Backend calls Matterport API** → Gets measurements
8. **Form auto-fills** → Floor area, ceiling height, etc.
9. **User continues form** → Steps 3-7
10. **Calculation uses Matterport data** → More accurate results

### **Web/Desktop - Limited Flow:**

1. **User starts form** → Step 2: Building Basics
2. **Clicks "Use Matterport Scan"** → Opens Matterport website
3. **User enters Model SID** → If they have existing scan
4. **App calls backend** → `/api/matterport/extract-measurements`
5. **Form auto-fills** → Same as mobile
6. **User continues form** → Steps 3-7

**Note:** Web users **cannot create new scans** (mobile-only), but can use existing scans.

## ⚠️ Important Considerations

### **1. Matterport Capture is Mobile-Only**
- ✅ **iOS/Android**: Can create scans
- ❌ **Web/Desktop**: Cannot create scans (only view)

### **2. Data Extraction Requires API Access**
- Need **Matterport REST API** access
- Use **API Tokens** (Token ID + Token Secret) - already configured ✅
- Extract measurements on **backend** (more secure)

### **3. Model SID Management**
- Each scan has unique **Model SID** (Space ID)
- Users need to:
  - Create scan (mobile) OR
  - Have existing scan Model SID
- Consider storing Model SIDs per user

### **4. Free Tier Limitations**
- Free tier: **1 active space**
- Users may need to delete old scans to create new ones
- Or upgrade to paid plan

## 🎯 Recommended Implementation

### **Phase 1: Basic Integration**
1. Add "Use Matterport Scan" button to Step 2
2. Allow user to input Model SID
3. Call backend to extract measurements
4. Auto-fill form fields

### **Phase 2: Mobile Deep Link**
1. Add deep link to Matterport Capture app
2. After scan, return to app with Model SID
3. Auto-extract and fill

### **Phase 3: Scan Management**
1. Store user's Model SIDs
2. Allow selecting from previous scans
3. Show scan previews

## 📝 Summary

### **Where Matterport Should Be Used:**
- ✅ **Step 2: Building Basics** - Auto-fill room dimensions
- ✅ **Backend**: Extract measurements via REST API
- ✅ **Calculation**: Use Matterport data if available

### **Platform Requirements:**
- ✅ **Mobile (iOS/Android)**: Full support (create + view scans)
- ⚠️ **Web/Desktop**: Limited support (view only, cannot create scans)

### **Current Status:**
- ❌ **Not integrated** into form flow
- ✅ **SDK configured** for viewing
- ⚠️ **Data extraction** not implemented
- ✅ **Backend ready** to accept roomData

### **Next Steps:**
1. Add Matterport button to Step2Building
2. Create backend endpoint for measurement extraction
3. Implement auto-fill functionality
4. Test on mobile and web


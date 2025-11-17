# How to Get Matterport Model SID (Space ID)

## Quick Methods

### Method 1: From Matterport Web Dashboard (Easiest)

1. **Go to Matterport Website:**
   - Open your browser
   - Go to: https://my.matterport.com
   - Log in with your Matterport account

2. **Navigate to Your Spaces:**
   - Click on "Spaces" in the left sidebar
   - Find your scan (e.g., "101 Massachusetts Ave")

3. **Get Model SID:**
   - Click on your space/scan
   - The Model SID is in the URL: `https://my.matterport.com/showcase/?m=YOUR_MODEL_SID_HERE`
   - OR look in the scan details/settings
   - The Model SID is typically a long alphanumeric string (e.g., `abc123xyz456`)

### Method 2: From Matterport App

1. **Open Matterport App:**
   - Open the Matterport Capture app on your phone
   - Go to "Spaces" tab (bottom navigation)

2. **Select Your Scan:**
   - Tap on your scan (e.g., "101 Massachusetts Ave")

3. **View Scan Details:**
   - Tap the three-dot menu (⋮) in the top right
   - Look for "Details" or "Info"
   - The Model SID should be listed there

4. **Alternative: Share/Export:**
   - Tap "Share" or "Export"
   - The Model SID might be in the share link or export options

### Method 3: From Scan URL

If you've shared or viewed your scan:

1. **Get the Share Link:**
   - From Matterport web dashboard
   - Click "Share" on your scan
   - Copy the share link

2. **Extract Model SID from URL:**
   ```
   https://my.matterport.com/showcase/?m=YOUR_MODEL_SID_HERE
                                    ^^^^^^^^^^^^^^^^^^^^^^^^
                                    This is your Model SID
   ```

   Example:
   ```
   https://my.matterport.com/showcase/?m=abc123xyz456
   Model SID = abc123xyz456
   ```

### Method 4: From Matterport API (Advanced)

If you have API access:

1. **List Your Spaces:**
   ```bash
   curl -X GET "https://api.matterport.com/api/v1/spaces" \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Response includes Model SIDs:**
   ```json
   {
     "spaces": [
       {
         "id": "YOUR_MODEL_SID",
         "name": "101 Massachusetts Ave",
         ...
       }
     ]
   }
   ```

## Visual Guide

### In Matterport Web Dashboard:

```
┌─────────────────────────────────────┐
│  Matterport Dashboard               │
├─────────────────────────────────────┤
│  Spaces                             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 101 Massachusetts Ave       │   │
│  │ Created: Nov 16, 2025        │   │
│  │                             │   │
│  │ [Click to open]              │   │
│  └─────────────────────────────┘   │
│                                     │
│  URL: my.matterport.com/showcase/   │
│       ?m=abc123xyz456  ← Model SID  │
└─────────────────────────────────────┘
```

### In Matterport App:

1. **Spaces Tab:**
   ```
   ┌─────────────────────┐
   │  Spaces             │
   ├─────────────────────┤
   │  [Processing]       │
   │  101 Massachusetts  │
   │  Ave                │
   │                     │
   │  [Tap to open]      │
   └─────────────────────┘
   ```

2. **Scan Details:**
   ```
   ┌─────────────────────┐
   │  ← 101 Mass Ave     │
   ├─────────────────────┤
   │  Details            │
   │                     │
   │  Model SID:         │
   │  abc123xyz456       │ ← Copy this
   │                     │
   │  [Share] [Export]   │
   └─────────────────────┘
   ```

## Using Model SID in Your App

Once you have the Model SID:

1. **Open Your App:**
   - Navigate to Step 2: Building Basics
   - Click "Use Matterport Scan"

2. **Enter Model SID:**
   - In the modal, paste your Model SID
   - Click "Extract Measurements"

3. **Auto-Fill:**
   - Form fields will automatically fill with measurements from your scan

## Example Model SID Format

Model SIDs typically look like:
- `abc123xyz456`
- `3jXK7mN9pQ2`
- `a1b2c3d4e5f6`
- `XYZ789ABC123`

**Length:** Usually 10-20 characters
**Format:** Alphanumeric (letters and numbers)

## Troubleshooting

### "Model SID not found"
- Make sure the scan is **processed** (not just uploaded)
- Check that the scan is **active** (not archived)
- Verify you're using the correct account

### "Invalid Model SID format"
- Model SID should be alphanumeric only
- No spaces or special characters
- Copy the entire SID from the URL

### "Failed to extract measurements"
- Ensure the scan is fully processed
- Check that the scan is accessible (not private/restricted)
- Verify Matterport API credentials are correct

## Quick Checklist

- [ ] Scan is completed and processed
- [ ] You have access to Matterport web dashboard
- [ ] Model SID is copied from URL or details
- [ ] Model SID is alphanumeric (no spaces)
- [ ] Ready to paste into your app

## Next Steps

1. ✅ Get Model SID (using methods above)
2. ✅ Open your app → Step 2
3. ✅ Click "Use Matterport Scan"
4. ✅ Paste Model SID
5. ✅ Click "Extract Measurements"
6. ✅ Form auto-fills with room dimensions!

---

**Tip:** Save your Model SID somewhere safe - you'll need it to extract measurements or view the scan later!


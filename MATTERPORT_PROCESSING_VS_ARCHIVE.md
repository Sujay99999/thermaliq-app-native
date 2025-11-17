# Matterport: Processing vs Archive vs Using SID

## Understanding Matterport Scan States

### 1. **Processing State** (What You're Experiencing)

**What it means:**
- Your scan is being processed by Matterport servers
- The 3D model, measurements, and data are being generated
- This can take **15 minutes to several hours** depending on:
  - Scan size/complexity
  - Number of capture points
  - Server load
  - Account tier (free tier may be slower)

**What you CAN'T do while processing:**
- ❌ Extract measurements (not ready yet)
- ❌ Get accurate Model SID (may not be fully accessible)
- ❌ Use the scan in your app

**What you CAN do:**
- ✅ Wait for processing to complete
- ✅ Check processing status in Matterport app/dashboard
- ✅ Use the scan once it's done

### 2. **Archive/Zip the Model**

**What it means:**
- **Archive:** Moves the scan to archived state (inactive)
- **Zip/Export:** Downloads the scan data as a file (MatterPak format)
- This is for **backup/offline storage**

**When to use:**
- You want to keep a backup of the scan
- You need offline access to scan data
- You're cleaning up your active spaces (free tier has 1 active space limit)

**What you get:**
- MatterPak file (.zip) containing:
  - 3D model data
  - Textures
  - Metadata
  - **BUT:** This is for viewing/backup, not for API access

**Limitations:**
- Archived scans may not be accessible via API
- Zipped MatterPak is for offline viewing, not for extracting measurements via API
- You still need the Model SID for API access

### 3. **Using Model SID (What You Need)**

**What it means:**
- Model SID is the **unique identifier** for your processed scan
- Used to access the scan via:
  - Matterport API (for measurements)
  - Matterport SDK (for viewing)
  - Your app's integration

**When to use:**
- After scan is **fully processed**
- To extract measurements in your app
- To view the scan in Matterport viewer

**Requirements:**
- ✅ Scan must be **processed** (not just uploaded)
- ✅ Scan must be **active** (not archived)
- ✅ You need the Model SID string

## Key Differences

| Feature | Processing | Archive/Zip | Using SID |
|---------|-----------|------------|-----------|
| **Purpose** | Generating 3D model | Backup/storage | API/App access |
| **Timing** | After upload | Anytime | After processing |
| **API Access** | ❌ No | ❌ No (if archived) | ✅ Yes |
| **Measurements** | ❌ Not ready | ❌ Not available | ✅ Available |
| **App Integration** | ❌ Can't use | ❌ Can't use | ✅ Can use |
| **File Format** | N/A | MatterPak (.zip) | String (SID) |

## What to Do While Processing

### Option 1: Wait for Processing (Recommended)

1. **Check Status:**
   - Matterport app: Look for "Processing" badge
   - Matterport dashboard: Check scan status
   - Wait until it shows "Complete" or "Ready"

2. **Processing Time:**
   - Small rooms: 15-30 minutes
   - Medium rooms: 30-60 minutes
   - Large/complex spaces: 1-3 hours
   - Free tier: May take longer

3. **Once Complete:**
   - Get Model SID from dashboard/app
   - Use in your app to extract measurements

### Option 2: Use Fallback Data (Development)

If you need to test your app **while waiting**:

1. **Use Test/Example Model SID:**
   - The backend has fallback data for development
   - You can test the flow with any Model SID
   - It will return example measurements

2. **Manual Entry:**
   - Enter room dimensions manually in Step 2
   - Test the rest of your form
   - Come back to Matterport integration later

### Option 3: Check Processing Status

**In Matterport App:**
- Go to "Spaces" tab
- Look for "Processing" badge (red icon with squares)
- Tap the scan to see detailed status

**In Matterport Dashboard:**
- Go to https://my.matterport.com
- Check "Spaces" section
- Status will show: "Processing", "Complete", or "Error"

## Why Processing Takes Time

Matterport processing involves:
1. **Point Cloud Generation** - Creating 3D points from images
2. **Mesh Creation** - Building 3D surfaces
3. **Texture Mapping** - Applying images to surfaces
4. **Measurement Calculation** - Computing dimensions
5. **Optimization** - Compressing for web/mobile viewing

**Factors affecting speed:**
- Number of capture points (more = longer)
- Room complexity (furniture, windows, etc.)
- Account tier (paid = faster processing)
- Server load (peak times = slower)

## Best Practice Workflow

### For Your App Integration:

1. **Create Scan** ✅ (You've done this)
2. **Wait for Processing** ⏳ (You're here now)
3. **Get Model SID** (Once processing completes)
4. **Use in App** (Extract measurements)

### While Waiting:

- ✅ Test other parts of your app
- ✅ Use manual entry to test form flow
- ✅ Check Matterport dashboard periodically
- ✅ Set up notifications (if available)

## Troubleshooting Long Processing

### If Processing Takes Too Long (>3 hours):

1. **Check for Errors:**
   - Matterport dashboard → Check scan status
   - Look for error messages
   - Check email notifications

2. **Contact Matterport Support:**
   - If scan is stuck in processing
   - If you see error messages
   - If processing fails

3. **Try Re-uploading:**
   - If scan fails, you may need to re-scan
   - Check scan quality (too dark/blurry = issues)

4. **Check Account Limits:**
   - Free tier: 1 active space
   - If you have another active scan, archive it
   - Processing may be queued

## Summary

**For Your App Integration:**

- ❌ **Don't archive** - You need the scan active to use the SID
- ❌ **Don't zip** - MatterPak is for backup, not API access
- ✅ **Wait for processing** - Required before using SID
- ✅ **Use Model SID** - This is what your app needs

**The Model SID is the key** - Once processing completes, you'll get the SID and can use it in your app to extract measurements. Archiving or zipping won't help with API access - you need the active, processed scan with its SID.

## Quick Answer

**Q: Should I archive/zip while processing?**
**A: No** - Keep it active. Archiving makes it inaccessible via API.

**Q: Can I use the SID while processing?**
**A: No** - Wait for processing to complete. Measurements aren't ready yet.

**Q: What should I do now?**
**A: Wait for processing to complete, then get the Model SID and use it in your app.**


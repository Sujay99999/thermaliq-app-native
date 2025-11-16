# Matterport Research & Analysis

## Your Understanding vs Reality

### ❌ **Partially Correct, But Important Differences:**

**What you said:**
- Photo-based room measurement tool
- Upload photos to get 2D and 3D plans

**Reality:**
- **Not simple photo upload** - Matterport uses **360° scanning** with their Capture app
- Requires **walking around** with a smartphone or 360° camera
- Creates **3D virtual tours** (not just plans)
- Generates **schematic floor plans** as an additional feature (paid)

## How Matterport Actually Works

### 1. **Capture Process**
- Use Matterport Capture app on iOS/Android
- Walk around the room while the app captures 360° images
- App uses phone's camera and sensors (gyroscope, accelerometer)
- Creates a 3D point cloud and mesh from the scan
- **NOT** a simple "upload photos" workflow

### 2. **Output**
- **3D Virtual Tour** (interactive walkthrough)
- **Measurements** (accurate to 1-2%)
- **Photo galleries** (auto-generated)
- **Schematic Floor Plans** (2D black & white drawings) - **PAID FEATURE**

## Free Tier Analysis

### ✅ **Free Forever Plan Includes:**
- Create 3D tours using smartphone or 360° camera
- Accurate measurements of rooms and objects
- Room labeling
- Photo galleries
- Tour highlights
- **Limitations:**
  - Only **1 active space**
  - Only **2 users**
  - **NO schematic floor plans**
  - **NO MatterPak files** (3D model exports)

### 💰 **Paid Plans:**
- **Starter Plan**: $9.99/month (annual billing)
  - 5-20 active spaces
  - 3 users
  - **Schematic floor plans** (additional $36 per plan)
  - MatterPak files
  - Sharing & embedding

## API/SDK Access

### ⚠️ **Important Limitations:**
- Matterport primarily focuses on **consumer/professional scanning**
- **API access** may require:
  - Enterprise/Developer account
  - Paid subscription
  - Approval process
- **No clear free API tier** for developers

### Available Developer Tools:
- **Matterport SDK** - For embedding 3D tours in apps
- **REST API** - For accessing Matterport data
- **Webhooks** - For real-time updates
- **MatterPak** - 3D model export format

## Comparison: Matterport vs Your Needs

| Feature | Matterport | Your App Needs |
|---------|-----------|----------------|
| **Input Method** | 360° scanning (walk around) | Photo upload |
| **Platform** | iOS/Android app | React Native/Expo |
| **Free Tier** | ✅ Yes (limited) | ✅ Yes |
| **Floor Plans** | ✅ Yes (paid) | ✅ Needed |
| **API Access** | ⚠️ Likely paid | ✅ Needed |
| **Integration** | SDK available | Need to verify |
| **Photo Upload** | ❌ No | ✅ Yes |

## Key Differences from Your Description

### 1. **Not Photo Upload**
- Matterport requires **active scanning** with their app
- You walk around and it captures in real-time
- Cannot simply upload existing photos

### 2. **360° Scanning Required**
- Uses panoramic/360° capture technology
- Not standard photos
- Requires specific capture workflow

### 3. **Floor Plans are Paid**
- Free tier does **NOT** include floor plans
- Need Starter plan ($9.99/month) + $36 per floor plan
- Delivered within 2 business days (not instant)

## Can You Use It?

### ✅ **Possible, But With Caveats:**

**Pros:**
- Free tier exists for testing
- SDK available for integration
- Accurate measurements
- Professional floor plans

**Cons:**
- **Not photo upload** - requires their capture app
- Floor plans require paid subscription
- API access likely requires paid plan
- Different workflow than you described
- May not fit your "upload photos" use case

## Alternative Approach

If you want **photo upload** functionality, consider:

1. **Apple RoomPlan** (what you were trying before)
   - iOS only
   - LiDAR required
   - Free (with Apple Developer account)
   - Real-time AR scanning

2. **ARCore** (Google)
   - Android/iOS
   - No LiDAR required
   - Free
   - Photo-based possible

3. **Custom ML Solution**
   - Use computer vision APIs
   - Upload photos
   - Generate measurements
   - More control, more work

4. **Matterport SDK Integration**
   - Integrate their Capture SDK
   - Users scan with Matterport app
   - Your app receives the data
   - Still requires their scanning workflow

## Recommendation

### ❌ **Matterport is NOT ideal if:**
- You need simple photo upload
- You want free floor plans
- You need instant results
- You want users to upload existing photos

### ✅ **Matterport COULD work if:**
- You're okay with 360° scanning workflow
- You can afford paid plans ($9.99+/month + $36/floor plan)
- You want professional-quality output
- You need 3D virtual tours (not just plans)

## Next Steps

1. **Verify API Access:**
   - Contact Matterport sales/developer support
   - Ask about free API tier
   - Check SDK documentation

2. **Test Free Tier:**
   - Download Matterport Capture app
   - Try scanning a room
   - See if it meets your needs

3. **Consider Alternatives:**
   - Revisit Apple RoomPlan (if iOS-only is acceptable)
   - Look into ARCore for cross-platform
   - Research computer vision APIs (Google Vision, AWS Rekognition)

## Resources

- Matterport Plans: https://matterport.com/plans
- Matterport Floor Plans: https://matterport.com/schematic-floor-plans
- Developer Documentation: https://support.matterport.com/s/article/API-SDK-Developer-Tools-Overview

## Conclusion

**Your understanding is partially correct**, but Matterport:
- ✅ Does create 2D/3D plans
- ✅ Has a free tier
- ❌ Does NOT work with simple photo uploads
- ❌ Requires 360° scanning workflow
- ❌ Floor plans are paid feature

**For your use case** (photo upload → floor plans), Matterport may not be the best fit unless you're willing to change your workflow to use their scanning app.


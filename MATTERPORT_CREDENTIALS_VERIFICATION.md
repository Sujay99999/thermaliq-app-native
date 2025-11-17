# Matterport Credentials Verification

## ✅ Credentials Configured

### SDK Key (Application Key)
- **Value**: `zsa4sfk5fikarpikt15drcdmb`
- **Location**: `src/config/matterport.js` → `APPLICATION_KEY`
- **Usage**: Used for embedding Matterport 3D viewers
- **Where it's used**:
  1. Iframe URL: `https://my.matterport.com/showcase/embed?m={modelSid}&applicationKey={sdkKey}`
  2. SDK Connection: `MP_SDK.connect(iframe, sdkKey)`

### API Tokens (For REST API - Optional)
- **Token ID**: `245a11276b221242`
- **Token Secret**: `3dc44cd146598a04b52a48506e78d27e`
- **Location**: `src/config/matterport.js` → `API_TOKEN_ID` and `API_TOKEN_SECRET`
- **Usage**: For REST API calls (not needed for SDK viewer)
- **Note**: These are stored but not currently used. Available via `getAPIToken()` helper if needed.

## 🔍 Implementation Verification

### 1. Config File (`src/config/matterport.js`)
✅ **SDK Key is correctly set**:
```javascript
APPLICATION_KEY: 'zsa4sfk5fikarpikt15drcdmb'
```

✅ **API Tokens are stored** (for future REST API use):
```javascript
API_TOKEN_ID: '245a11276b221242'
API_TOKEN_SECRET: '3dc44cd146598a04b52a48506e78d27e'
```

### 2. RoomScan Component (`src/screens/RoomScan.jsx`)
✅ **Correctly passes SDK Key to MatterportViewer**:
```javascript
<MatterportViewer
  modelSid={MATTERPORT_MODEL_SID}
  applicationKey={MATTERPORT_CONFIG?.APPLICATION_KEY}  // ✅ Uses SDK Key
  ...
/>
```

### 3. MatterportViewer Component (`src/components/matterport/MatterportViewer.jsx`)
✅ **SDK Key used in iframe URL** (Line 65):
```javascript
iframe.src = `https://my.matterport.com/showcase/embed?m=${modelSid}&applicationKey=${applicationKey}`;
```

✅ **SDK Key used in SDK connection** (Line 72):
```javascript
mpSdk = await iframe.contentWindow.MP_SDK.connect(iframe, applicationKey);
```

## 📋 Credential Flow

```
Matterport Account
    ↓
SDK Key Management → SDK Key: zsa4sfk5fikarpikt15drcdmb
    ↓
src/config/matterport.js → APPLICATION_KEY
    ↓
RoomScan.jsx → MATTERPORT_CONFIG.APPLICATION_KEY
    ↓
MatterportViewer.jsx → applicationKey prop
    ↓
HTML iframe URL → ?applicationKey=zsa4sfk5fikarpikt15drcdmb
    ↓
MP_SDK.connect(iframe, applicationKey)
```

## ⚠️ Important Notes

### SDK Key vs API Tokens

**SDK Key** (what we're using):
- Used for **embedding 3D viewers** in web/mobile apps
- Used in iframe URLs and SDK.connect()
- **This is what you need for the viewer to work**

**API Tokens** (stored but not used):
- Used for **REST API calls** to Matterport
- Token ID + Token Secret together authenticate API requests
- Not needed for the SDK viewer, but stored for future use

### Security Considerations

1. **Current Setup**: SDK Key is hardcoded in config file
   - ✅ Works for development/testing
   - ⚠️ For production, use environment variables

2. **Recommended Production Setup**:
   ```bash
   # .env file
   EXPO_PUBLIC_MATTERPORT_APP_KEY=zsa4sfk5fikarpikt15drcdmb
   EXPO_PUBLIC_MATTERPORT_MODEL_SID=your_model_sid_here
   ```

3. **SDK Key Security**:
   - SDK Keys are **public keys** (safe to expose in client-side code)
   - They're designed to be used in frontend applications
   - Domain restrictions can be set in Matterport account

4. **API Token Security**:
   - Token Secret is **private** (should never be exposed)
   - Only use API tokens in backend/server-side code
   - Never commit token secrets to version control

## ✅ Verification Checklist

- [x] SDK Key correctly set in config file
- [x] SDK Key passed from RoomScan to MatterportViewer
- [x] SDK Key used in iframe URL
- [x] SDK Key used in SDK.connect()
- [x] API Tokens stored (for future REST API use)
- [x] Validation function checks for SDK Key
- [x] Error messages are clear

## 🚀 Next Steps

1. **Get a Model SID**:
   - Create a Matterport scan using Matterport Capture app
   - Get the Space ID (Model SID) from the scan
   - Update `DEFAULT_MODEL_SID` in config or pass it dynamically

2. **Test the Integration**:
   - Run the app: `npm start`
   - Navigate to RoomScan screen
   - Click "View Matterport Scan"
   - Verify the viewer loads

3. **For Production**:
   - Move credentials to environment variables
   - Set up domain restrictions in Matterport account
   - Never commit credentials to git

## 📝 Summary

✅ **All credentials are correctly configured and used**

- SDK Key (`zsa4sfk5fikarpikt15drcdmb`) is properly set and used in the viewer
- API Tokens are stored for future REST API use
- Implementation correctly uses SDK Key in both iframe URL and SDK connection
- Code flow is verified: Config → RoomScan → MatterportViewer → HTML/JS

**The only remaining requirement is a Model SID (Space ID) from an actual Matterport scan to test the viewer.**


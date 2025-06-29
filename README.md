# Salesforce Default Page Extension

A Chrome extension that allows you to set a custom default page when logging into Salesforce, instead of being redirected to the standard home page.

## Features

- Set a custom default page for Salesforce login
- Support for common Salesforce pages (Deployment, Users, Profiles, etc.)
- Custom page paths support
- Light/Dark theme toggle
- Enhanced Safe Browsing compliant

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store listing
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Usage

1. Click the extension icon in your Chrome toolbar
2. Choose your preferred default page from the dropdown
3. Or enter a custom Lightning page path
4. Toggle the extension on/off as needed
5. Log into Salesforce and you'll be redirected to your chosen page

## Supported Pages

- **Deployment**: Setup > Deployment > Deployment Status
- **Users**: Setup > Users > Users
- **Profiles**: Setup > Users > Profiles
- **Permission Sets**: Setup > Users > Permission Sets
- **Flows**: Setup > Process Automation > Flows
- **Apex Classes**: Setup > Apex Classes
- **Objects**: Setup > Object Manager
- **Home**: Standard Salesforce home page
- **Custom**: Any custom Lightning page path

## Security & Privacy

This extension is designed with security and privacy in mind:

- **No data collection**: The extension does not collect or transmit any personal information
- **Local storage only**: All settings are stored locally in your browser
- **Limited permissions**: Only accesses Salesforce domains
- **Enhanced Safe Browsing compliant**: Follows Chrome's security best practices

### Enhanced Safe Browsing

If you see a warning about "This extension is not trusted by Enhanced Safe Browsing", this is normal for extensions not published on the Chrome Web Store. The extension is safe to use and includes:

- Content Security Policy (CSP) restrictions
- Minimal required permissions
- No external data transmission
- Privacy policy compliance
- Secure coding practices

To trust the extension:
1. Click "Details" in the warning
2. Click "Continue to site" or "Allow"
3. The extension will work normally

## Permissions

- **activeTab**: Required to interact with Salesforce pages
- **storage**: Required to save your preferences locally
- **host_permissions**: Limited to Salesforce domains only

## Development

### Version History
- v0.43: Enhanced Safe Browsing compliance improvements
- v0.42: Previous version
- [See full changelog for earlier versions]

### Building from Source
1. Clone the repository
2. Make your changes
3. Test in Chrome's developer mode
4. Update version number in `manifest.json`

## Troubleshooting

### Extension Not Working
1. Ensure you're on a Salesforce domain
2. Check that the extension is enabled
3. Try refreshing the Salesforce page
4. Clear browser cache and cookies

### Enhanced Safe Browsing Warning
This is normal for unpublished extensions. The extension is safe and follows security best practices.

## Privacy Policy

See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for detailed information about data handling and privacy.

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the privacy policy
3. Create an issue in the repository

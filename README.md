# camerascanner
Requests data from cameras

## Usage
### Including the scanner
The camera scanner can be included on a page by including the `scanner.js` file.

Please refer to `demo.html` or `test.html` for examples.

### Creating a new scanner
Any number of scanners can then be created by calling `camera_scanner.create()` with a number of parameters. A new scanner object will be returned.

The parameters are:
1. `camera_ids` - An array of ids to request data for
2. `timeout` - A custom timeout (in ms) to override the default (30 seconds)
3. `data_source` - Either a string representing a URL, or function. If a URL is provided, for each camera the URL will be queried via XHR GET with the camera_id after the trailing /. If a function is provided, for each camera the function will be called with the camera_id as a parameter. JSON data is expected as a return value from both.
4. `debug_enabled` - Will print debug data if `true`. (Defaults to `false`)

### Querying aggregate data
The following methods can be called on the scanner to query for aggregate information:
1. `camera_scanner.get_camera_id_with_most_data()` - Returns an id
2. `camera_scanner.get_camera_id_with_most_images()` - Returns an id
3. `camera_scanner.get_largest_images_per_camera()` - Returns an array of objects in the format `{id, size}`

## Testing
Unit tests are provided in the `tests.js` file and an example run of the suite is provided in `test.html`

### After-scan callback
If `camera_scanner.end_scan_callback` is defined it will be called when the last camera has been scanned or timed out. This can be useful for testing.

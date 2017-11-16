/*
 * Camera image aggregation tool
 */

const camera_scanner = (function(){
  const DEFAULT_TIMEOUT = 30000; // 30 seconds

  
  /*
   * Utility functions
   */
  function xhr_get(url, timeout, callback){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if( xhr.readyState != 4 || xhr.status != 200 ) return;
      callback(xhr.response);
    }
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.timeout = timeout;
    xhr.send();
  }

  function print_debug(scanner, message){
    if(!scanner.debug_enabled) return;
    console.log(message);
  }


  /*
   * Scan result handling
   */
  function parse_response(response){
    const largest_image = {id: null, size: null};
    let total_size = 0;
    Object.keys(response.images).forEach(function(image_key){
      let file_size = response.images[image_key].file_size;
      total_size += file_size;
      if(file_size > largest_image.size){
        largest_image.id = image_key;
        largest_image.size = file_size;
      }
    });

    return {
      response,
      total_size,
      num_images: response.images.length,
      largest_image,
    };
  }

  function update_scanner_queries(scanner, camera_id, total_size, num_images, largest_image){
    if(scanner.queries.most_data.total_size < total_size)
      scanner.queries.most_data = {camera_id, total_size};

    if(scanner.queries.most_images.num_images < num_images)
      scanner.queries.most_images = {camera_id, num_images};

    scanner.queries.largest_images_per_camera[camera_id] = largest_image;
  }

  function end_scan(scanner){
    scanner.finished_scanning = true;
    scanner.debug("Scanning finished.");
    scanner.end_scan_callback();
  }


  /*
   * Camera scanning functions
   */
  function record_camera_response(scanner, camera_id, response){
    const parsed_response = parse_response(response);
    scanner.scan_results[camera_id] = parsed_response;
    update_scanner_queries(
      scanner,
      camera_id,
      parsed_response.total_size,
      parsed_response.num_images,
      parsed_response.largest_image
    );
  }

  function abort_scan(scanner, camera_id){
    scanner.debug("\tTimeout. Aborting scan for " + camera_id);
    remove_from_unscanned_list(scanner, camera_id);
  }

  function remove_from_unscanned_list(scanner, camera_id){
    scanner.unscanned_cameras = scanner.unscanned_cameras.filter(function(unscanned_camera_id){
      return unscanned_camera_id != camera_id;
    });
    if(scanner.unscanned_cameras.length < 1){
      end_scan(scanner);
    }
  }

  function handle_response(scanner, camera_id, response){
    let parsed_response = JSON.parse(response);
    if(parsed_response["camera_id"] != undefined)
      record_camera_response(scanner, camera_id, parsed_response);

    remove_from_unscanned_list(scanner, camera_id);
  }

  function request_from_url(url, camera_id, timeout, callback){
    xhr_get(url+camera_id, timeout, callback);
  }

  function request_from_function(test_function, camera_id, callback){
    callback(test_function(camera_id));
  }

  function scan_camera(scanner, camera_id, timeout, callback){
    if(typeof scanner.data_source === "function")
      request_from_function(scanner.data_source, camera_id, callback);
    else
      request_from_url(scanner.data_source, camera_id, timeout, callback);
  }

  function run_scans(scanner){
    scanner.debug("Running scans...");

    scanner.unscanned_cameras.forEach(function(camera_id){
      scanner.debug("\tRequesting scan for camera " + camera_id);

      let timeout = setTimeout(function(){abort_scan(scanner, camera_id)}, scanner.timeout);
      scanner.finished_scanning = false;

      scan_camera(scanner, camera_id, scanner.timeout, function(response){
        scanner.debug("\tScan finished for camera " + camera_id );
        handle_response(scanner, camera_id, response);
        clearTimeout(timeout);
      });
    });
  }


  /*
   * Expose API
   */
  return {
    /*
     * Create a new scanner
     * 
     * Params:
     *   camera_ids: An array of camera ids to be scanned
     *   timeout: How long the scanner should wait before aborting a request for data
     *   data_source: A URL to GET from, or a function to call
     *   debug_enabled: Will print debug information if true
     */
    create: function(camera_ids = [], timeout = DEFAULT_TIMEOUT, data_source = "", debug_enabled = false){
      const scanner = {
        camera_ids,
        timeout,
        data_source,
        debug_enabled,

        unscanned_cameras: camera_ids,
        finished_scanning: false,
        end_scan_callback: function(){},

        scan_results: {},
        queries: {
          most_data: {camera_id: null, total_size: null},
          most_images: {camera_id: null, num_images: null},
          largest_images_per_camera: {},
        },
      };

      scanner.run_scans = function(){ run_scans(scanner); }

      scanner.get_camera_id_with_most_data = function(){ return scanner.queries.most_data.camera_id; }
      scanner.get_camera_id_with_most_images = function(){ return scanner.queries.most_images.camera_id; }
      scanner.get_largest_images_per_camera = function(){ return scanner.queries.largest_images_per_camera; }

      scanner.debug = function(message){ print_debug(scanner, message); }

      return scanner;
    }
  }
})();

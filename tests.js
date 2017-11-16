const one_second = 1000;

/*
 * Functions to return dummy camera data
 */
function empty_camera_fixture(camera_id){
  return JSON.stringify({camera_id, images: []});
}

function large_data_camera_fixture(camera_id){
  return JSON.stringify({
    camera_id,
    images: [
      {file_size: 42048},
      {file_size: 1000000},
      {file_size: 2000000},
    ]
  });
}

function large_count_camera_fixture(camera_id){
  return JSON.stringify({
    camera_id,
    images: [
      {file_size: 128},
      {file_size: 256},
      {file_size: 512},
      {file_size: 1024},
      {file_size: 2048},
    ]
  });
}


/*
 * Test endpoint
 *
 * Cameras with an id <= 10 will have large data
 * Cameras with an id > 10 will have large image counts
 */
function test_endpoint(camera_id){
  if(camera_id <= 10)
    return large_data_camera_fixture(camera_id);
  else
    return large_count_camera_fixture(camera_id);
}



/*
 * Unit tests
 */
function test_unscanned_cameras_are_scanned(){
  console.log("Scanner should scan cameras that have not yet been scanned");

  let cameras = [0, 1, 2, 500, 1000];
  let scanner = camera_scanner.create(cameras, one_second, empty_camera_fixture);

  if(scanner.unscanned_cameras.length != cameras.length) return false;

  scanner.run_scans();

  if(scanner.unscanned_cameras.length != 0) return false;
  if(Object.keys(scanner.scan_results).length != cameras.length) return false;

  return true;
}


function test_largest_data_is_identified(){
  console.log("Scanner should identify camera with the largest data usage");

  let cameras = [1, 25, 50, 75, 100];
  let target_camera = 1;

  let scanner = camera_scanner.create(cameras, one_second, test_endpoint);
  scanner.run_scans();

  if(scanner.get_camera_id_with_most_data() != target_camera) return false;

  return true;
}


function test_largest_image_count_is_identified(){
  console.log("Scanner should identify camera with the most images");

  let cameras = [1, 2, 3, 20];
  let target_camera = 20;

  let scanner = camera_scanner.create(cameras, one_second, test_endpoint);
  scanner.run_scans();

  if(scanner.get_camera_id_with_most_images() != target_camera) return false;

  return true;
}


function test_largest_image_for_each_camera_is_identified(){
  console.log("Scanner should identify the largest image on each camera");

  let cameras = [1, 100];
  let scanner = camera_scanner.create(cameras, one_second, test_endpoint);
  scanner.run_scans();

  let largest_per_camera = scanner.get_largest_images_per_camera();
  if(largest_per_camera[1].id != 2) return false;
  if(largest_per_camera[100].id != 4) return false;

  return true;
}

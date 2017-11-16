/*
 * For offline development testing of the camera scanner
 */

const test_cameras = (function(){

  /*
   * Test data
   */
  const cameras = {
    0: {
      response: {
        camera_id: 0,
        images: [
          {file_size: 42048},
          {file_size: 1024}
        ]
      }
    },

    1: {
      response: {
        camera_id: 1,
        images: [
          {file_size: 1},
        ]
      }
    },

    2: {
      response: {
        camera_id: 2,
        images: [
          {file_size: 1},
          {file_size: 1},
          {file_size: 1},
        ]
      }
    },

    3: {
      response: {
        camera_id: 3,
        images: [
          {file_size: 2048},
        ]
      }
    },

    4: {
      response: {
        camera_id: 4,
        images: [
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
          {file_size: 100},
          {file_size: 200},
          {file_size: 300},
          {file_size: 400},
        ]
      }
    },

    5: {
      response: {
        camera_id: 5,
        images: [
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
          {file_size: 1024},
          {file_size: 2048},
          {file_size: 4096},
        ]
      }
    },

    6: {
      response: {
        camera_id: 6,
        images: [
          {file_size: 1024000000},
          {file_size: 2048000000},
        ]
      }
    },
  }


  /*
   * Endpoint method
   */
  function request_camera_data(camera_id){
    return JSON.stringify(cameras[camera_id].response);
  }


  /*
   * Expose API
   */
  return {
    request_camera_data,
  }
})();

/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var ui = ripple('ui'),
    event = ripple('event'),
    upload = document.getElementById('file-upload'),
    select = document.getElementById('select-file'),
    take = document.getElementById('take-file'),
    optOut = document.getElementById('camera-cancel'),
    result = document.getElementById("camera-result");

function getType() {
    return (upload.getAttribute('accept') || "").replace("/*", "");
}

function clear() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

module.exports = {
    initialize: function () {
        select.addEventListener('click', function () {
            upload.click();
        });

        upload.addEventListener('change', function () {
            clear();

            var capture = document.createElement(getType());
            capture.setAttribute("controls");
            capture.style.display = "inline";
            capture.style.height = (screen.availHeight - 50) + "px";
            capture.src = window.webkitURL.createObjectURL(upload.files[0]);

            result.appendChild(capture);


            take.style.display = "inline";
        });

        take.addEventListener('click', function () {
            //console.log("type", getType());
            event.trigger('captured-' + getType(), [result.firstChild.src, upload.files[0]]);
            module.exports.hide();
        });

        optOut.addEventListener('click', function () {
            console.log('capture-image cancelled');
            event.trigger('image-capture-cancelled');
            ui.hideOverlay("camera-window");
        });
    },
    show: function (type) {
        type = type || "image";
        ui.showOverlay("camera-window");

        if (getType() !== type) {
            clear();
        }
        upload.setAttribute("accept", type + "/*");

        if (result.firstChild && result.firstChild.src) {
            take.style.display = "inline";
        }
        else {
            take.style.display = "none";
        }
        event.trigger('camera-opened');
    },
    hide: function () {
        if (result.firstChild && result.firstChild.pause) {
            result.firstChild.pause();
        }
        ui.hideOverlay("camera-window");
        event.trigger('camera-closed');
    }
};

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var screens = ['red', 'green', 'refactor'];
document.addEventListener('click', function (evt) {
    console.log('fired');
    if (event.target.getAttribute('class') == 'screen') {
        var oldScreenEle = evt.target;
        var oldScreen = oldScreenEle.id;
        var newScreen;
        var newScreenEle;

        screens.forEach(function (screenId, i) {
            console.log('fired2')
            if (screenId == oldScreen) {
                console.log('fired3')
                if ((i + 1) < screens.length) {
                    console.log('fired4')
                    newScreen = screens[i + 1];
                } else {
                    newScreen = screens[0];
                }
            }
            newScreenEle = document.getElementById(newScreen);
        });
        newScreenEle.style.webkitTransform = 'translate(0px,0px)';
        oldScreenEle.style.webkitTransform = 'translate(-320px,0px)';
    }
});
// Simple connection popup that only appears on initial page load
document.addEventListener('DOMContentLoaded', function() {
    console.log("Simple popup script loaded");
    
    // Get reference to the popup element
    const connectionPopup = document.querySelector('.simple-connection-popup');
    const popupTitle = document.querySelector('.simple-popup-title');
    const popupMessage = document.querySelector('.simple-popup-message');
    
    if (!connectionPopup) {
        console.error("Simple connection popup element not found");
        return;
    }
      // Function to fetch IP address and location information
    function fetchIPInfo() {
        // Try the first API
        fetch('https://ipapi.co/json/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('First IP API failed');
                }
                return response.json();
            })
            .then(data => {
                console.log("IP data fetched:", data);
                
                // Update popup with IP and location info
                if (popupTitle) {
                    popupTitle.textContent = "Connection Established";
                }
                
                if (popupMessage) {
                    // Format the location information
                    let locationInfo = `IP: ${data.ip}`;
                    
                    if (data.city && data.region && data.country_name) {
                        locationInfo += `<br>Location: ${data.city}, ${data.region}, ${data.country_name}`;
                    }
                    
                    popupMessage.innerHTML = locationInfo;
                }
            })
            .catch(error => {
                console.error("Error fetching IP data from first API:", error);
                
                // Try the second API as fallback
                fetch('https://ipinfo.io/json')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Second IP API failed');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("IP data fetched from fallback:", data);
                        
                        if (popupMessage) {
                            // Format the location information
                            let locationInfo = `IP: ${data.ip}`;
                            
                            if (data.city && data.region && data.country) {
                                locationInfo += `<br>Location: ${data.city}, ${data.region}, ${data.country}`;
                            }
                            
                            popupMessage.innerHTML = locationInfo;
                        }
                    })                    .catch(secondError => {
                        console.error("Error fetching IP data from second API:", secondError);
                        
                        // Try the third API as a final fallback
                        fetch('https://api.ipify.org?format=json')
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Third IP API failed');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log("IP data fetched from third fallback:", data);
                                
                                if (popupMessage) {
                                    // This API only returns the IP address
                                    let locationInfo = `IP: ${data.ip}`;
                                    popupMessage.innerHTML = locationInfo;
                                }
                            })
                            .catch(thirdError => {
                                console.error("Error fetching IP data from third API:", thirdError);
                                // Final fallback message if all APIs fail
                                if (popupMessage) {
                                    popupMessage.textContent = "Secure connection established";
                                }
                            });
                    });
            });
    }
    
    // Only show the popup if we're not in fullscreen mode
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.mozFullScreenElement && 
        !document.msFullscreenElement) {
        
        // Fetch IP info first
        fetchIPInfo();
          // Wait 3 seconds and then show the popup
        setTimeout(function() {
            console.log("Showing simple connection popup");
            connectionPopup.classList.add('show');
        }, 3000); // 3000 milliseconds = 3 seconds
        
        // Get reference to the button
        const detailsButton = document.querySelector('.simple-popup-button');
        
        // Make the popup clickable to dismiss it
        connectionPopup.addEventListener('click', function(event) {
            // Don't dismiss if clicking on the button
            if (event.target.classList.contains('simple-popup-button')) {
                event.stopPropagation();
                return;
            }
            
            console.log("Simple connection popup clicked");
            connectionPopup.classList.remove('show');
            
            // Optional: You can add additional actions here when the popup is clicked
            // For example, show another element or trigger an action
        });
        
        // Add specific action for the details button
        if (detailsButton) {
            detailsButton.addEventListener('click', function(event) {
                console.log("Details button clicked");
                // Prevent the popup from being dismissed
                event.stopPropagation();
                
                // Add your custom button action here
                alert("Connection details: Your connection is secure and encrypted.");
            });
        }
    }
    
    // Hide the popup when entering fullscreen
    document.addEventListener('fullscreenchange', function() {
        if (document.fullscreenElement) {
            connectionPopup.classList.remove('show');
        }
    });
    
    // Support for other browser prefixes
    document.addEventListener('webkitfullscreenchange', function() {
        if (document.webkitFullscreenElement) {
            connectionPopup.classList.remove('show');
        }
    });
    
    document.addEventListener('mozfullscreenchange', function() {
        if (document.mozFullScreenElement) {
            connectionPopup.classList.remove('show');
        }
    });
    
    document.addEventListener('MSFullscreenChange', function() {
        if (document.msFullscreenElement) {
            connectionPopup.classList.remove('show');
        }
    });
});

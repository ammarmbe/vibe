self.addEventListener("push", async (event) => {
	if (event.data) {
		const { title, ...eventDataWithoutTitle } = await event.data.json();
		showLocalNotification(title, eventDataWithoutTitle, self.registration);
	}
});

const showLocalNotification = (title, body, swRegistration) => {
	swRegistration.showNotification(title, body);
};

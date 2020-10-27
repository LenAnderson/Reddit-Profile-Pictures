// ==UserScript==
// @name         Reddit - Profile Pictures
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-Profile-Pictures/raw/master/reddit_profile_pictures.user.js
// @version      1.1
// @description  Show profile pictures on reddit.
// @author       LenAnderson
// @match        https://www.reddit.com/r/*/comments/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const addAvatars = async(root=document)=>{
		Array.from(root.querySelectorAll('.author')).forEach(async(a)=>{
			const thing = a.closest('.thing');
			if (!thing) return;
			if (thing.hasAttribute('data-reddit-profile-picture')) return;
			const xhr = new XMLHttpRequest();
			xhr.open('GET', `${a.href}/about.json`);
			xhr.addEventListener('load', async()=>{
				if (thing.hasAttribute('data-reddit-profile-picture')) return;
				const profile = JSON.parse(xhr.responseText).data;
				const img = document.createElement('img'); {
					const ta = document.createElement('textarea');
					ta.innerHTML = profile.icon_img;
					img.classList.add('reddit-profile-picture');
					img.src = ta.value;
					img.style.height = '48px';
					img.style.float = 'left';
					img.style.marginRight = '7px';
					thing.insertBefore(img, thing.querySelector('.entry'));
				}
				thing.setAttribute('data-reddit-profile-picture', 1)
			});
			xhr.send();
		});
	};
	addAvatars();

	const mo = new MutationObserver((muts)=>{
		muts.forEach(mut=>{
			Array.from(mut.addedNodes).forEach(node=>{
				if (node instanceof HTMLElement) {
					addAvatars(node);
				}
			});
		});
	});
	mo.observe(document.body, {childList: true, subtree: true});
})();

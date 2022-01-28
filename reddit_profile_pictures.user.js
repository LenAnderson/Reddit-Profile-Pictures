// ==UserScript==
// @name         Reddit - Profile Pictures
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-Profile-Pictures/raw/master/reddit_profile_pictures.user.js
// @version      1.2
// @description  Show profile pictures on reddit.
// @author       LenAnderson
// @match        https://www.reddit.com/r/*/comments/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const addAvatars = async(root=document)=>{
		Array.from(root.querySelectorAll('.thing')).forEach(async(thing)=>{
			const a = thing.querySelector(`#${thing.id} > .entry > .tagline > .author`);
			if (!thing) return;
			if (thing.hasAttribute('data-reddit-profile-picture')) return;
			const img = document.createElement('img'); {
				img.classList.add('reddit-profile-picture');
				img.style.height = '48px';
				img.style.width = '48px';
				img.style.float = 'left';
				img.style.marginRight = '7px';
				thing.insertBefore(img, thing.querySelector('.entry'));
			}
			thing.setAttribute('data-reddit-profile-picture', 1);
			if (a && a.href) {
				const xhr = new XMLHttpRequest();
				xhr.open('GET', `${a.href}/about.json`);
				xhr.addEventListener('load', async()=>{
					const profile = JSON.parse(xhr.responseText).data;
					const ta = document.createElement('textarea');
					ta.innerHTML = profile.icon_img;
					img.src = ta.value;
				});
				xhr.send();
			}
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

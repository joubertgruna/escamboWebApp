<template>
  <div class="match-view" v-if="match">
    <div class="match-view__header p-3 text-center">
      <h5 class="fw-bold">Detalhes do Match</h5>
    </div>

    <div class="match-view__items p-3">
      <div class="row g-3">
        <div class="col-6">
          <div class="escambo-card p-2 text-center">
            <img
              :src="itemPhotoUrl(match.item1)"
              alt="Item 1"
              class="match-view__item-img mb-2"
            />
            <h6 class="small mb-0">{{ match.item1?.title }}</h6>
            <small class="text-muted">{{ match.user1?.name }}</small>
          </div>
        </div>
        <div class="col-6">
          <div class="escambo-card p-2 text-center">
            <img
              :src="itemPhotoUrl(match.item2)"
              alt="Item 2"
              class="match-view__item-img mb-2"
            />
            <h6 class="small mb-0">{{ match.item2?.title }}</h6>
            <small class="text-muted">{{ match.user2?.name }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 d-flex gap-2">
      <button class="btn btn-escambo flex-grow-1" @click="goToChat">
        💬 Conversar
      </button>
      <button class="btn btn-outline-secondary" @click="$router.back()">
        Voltar
      </button>
    </div>

    <AdOverlay
      v-if="showAd"
      :ad="currentAd"
      @close="closeAd"
    />
  </div>

  <AppLoader v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMatchesStore } from '@/stores/matches';
import { useAdsStore } from '@/stores/ads';
import AdOverlay from '@/components/ads/AdOverlay.vue';
import AppLoader from '@/components/common/AppLoader.vue';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_URL.replace('/api', '');

const route = useRoute();
const router = useRouter();
const matchesStore = useMatchesStore();
const adsStore = useAdsStore();

const match = ref(null);
const showAd = ref(false);
const currentAd = ref(null);

const itemPhotoUrl = (item) => {
  if (!item || !item.photos || item.photos.length === 0) {
    return '/placeholder-item.png';
  }
  const photoUrl = item.photos[0].url;
  return photoUrl.startsWith('http') ? photoUrl : `${BASE_URL}${photoUrl}`;
};

onMounted(async () => {
  try {
    const data = await matchesStore.fetchMatch(route.params.id);
    match.value = data;

    if (!data.ad_shown) {
      const ad = await adsStore.fetchNextAd();
      if (ad) {
        currentAd.value = ad;
        showAd.value = true;
        await matchesStore.markAdShown(route.params.id);
      }
    }
  } catch {
    router.replace('/matches');
  }
});

const closeAd = () => {
  showAd.value = false;
};

const goToChat = () => {
  router.push(`/chat/${route.params.id}`);
};
</script>

<style scoped lang="scss">
.match-view {
  padding-bottom: 80px;

  &__item-img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border-radius: 8px;
  }
}
</style>

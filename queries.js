import { createClient } from '@/lib/supabase/server';

export async function getStoreSettings() {
  const supabase = createClient();
  const { data } = await supabase.from('store_settings').select('key, value');
  const settings = {};
  (data || []).forEach((row) => {
    settings[row.key] = row.value;
  });
  return settings;
}

export async function getHomeContent() {
  const supabase = createClient();
  const { data } = await supabase.from('home_content').select('key, value');
  const content = {};
  (data || []).forEach((row) => {
    content[row.key] = row.value;
  });
  return content;
}

export async function getCategories() {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true });
  return data || [];
}

export async function getProducts({ onlyActive = true, categorySlug = null } = {}) {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select('*, product_images(url, position, is_main), categories(name, slug)')
    .order('position', { ascending: true });

  if (onlyActive) query = query.eq('status', 'active');
  if (categorySlug) query = query.eq('categories.slug', categorySlug);

  const { data, error } = await query;
  if (error) {
    console.error('Erro ao buscar produtos:', error.message);
    return [];
  }

  return (data || []).map(normalizeProduct);
}

export async function getProductBySlug(slug) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, position, is_main), categories(name, slug)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return normalizeProduct(data);
}

function normalizeProduct(row) {
  const images = (row.product_images || []).sort((a, b) => a.position - b.position);
  const main = images.find((i) => i.is_main) || images[0];
  return {
    ...row,
    images,
    image: main ? main.url : null,
  };
}

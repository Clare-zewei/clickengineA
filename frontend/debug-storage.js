// 检查Funnel Analysis V2存储的调试脚本
// 在浏览器控制台中运行此代码

console.log('=== Funnel Analysis V2 存储调试 ===');

// 存储键名
const storageKey = 'funnelAnalysisV2_funnels';

// 获取存储的数据
const storedData = localStorage.getItem(storageKey);

if (storedData) {
  try {
    const funnels = JSON.parse(storedData);
    console.log('存储的数据总数:', funnels.length);
    console.log('完整存储数据:', funnels);
    
    funnels.forEach((funnel, index) => {
      console.log(`\n--- Funnel ${index + 1} ---`);
      console.log('ID:', funnel.id);
      console.log('Name (名称):', funnel.name);
      console.log('Description (描述):', funnel.description);
      console.log('Status (状态):', funnel.status);
      console.log('Target Goal (目标):', funnel.targetGoal);
      console.log('Created At:', funnel.createdAt);
      console.log('Updated At:', funnel.updatedAt);
      console.log('Steps Count:', funnel.steps ? funnel.steps.length : 0);
    });
  } catch (error) {
    console.error('解析存储数据时出错:', error);
  }
} else {
  console.log('未找到存储数据，localStorage中没有键:', storageKey);
}

// 检查所有localStorage键
console.log('\n=== 所有 localStorage 键 ===');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(`${i + 1}. ${key}`);
}
/* ===== Game template — copy this file when injecting a new game =====
   Rename the global to Game_XX_name matching manifest id.
   Example for id "01": window.Game_01 = { mount }
*/
(function(){
  window.Game_TEMPLATE = {
    async mount(container){
      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:16px">
          <div style="font-size:64px">🎮</div>
          <div style="font-size:22px;color:#e0567f;font-weight:bold">اللعبة دي هتتحقن قريب!</div>
        </div>`;
    }
  };
})();

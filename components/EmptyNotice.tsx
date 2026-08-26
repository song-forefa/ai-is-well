export default function EmptyNotice({ envMissing }: { envMissing: boolean }) {
  return (
    <main className="site">
      <div className="empty">
        {envMissing ? (
          <>
            Supabase 환경변수가 아직 설정되지 않았어요.
            <br />
            <code>.env.local</code> 에 값을 채운 뒤 새로고침해 주세요.
          </>
        ) : (
          <>
            아직 등록된 항목이 없어요.
            <br />
            <a href="/admin">관리자 페이지</a>에서 첫 항목을 추가해 보세요.
          </>
        )}
      </div>
    </main>
  );
}

import React, { useState, useRef, useEffect } from 'react';

// === 💡 백엔드 서버 주소 설정 ===
const BACKEND_URL = 'https://birthday-backend-server.onrender.com';

// === 📸 사진 필수 알림 모달 컴포넌트 ===
export const PhotoRequiredModal = ({ isOpen, onClose, onUploadClick }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-amber-100/30 transform scale-100 animate-fadeIn">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-rose-50 mb-4 animate-bounce">
          <span className="text-3xl">📸</span>
        </div>
        <h3 className="text-lg font-black text-amber-950 mb-2">사진이 필요해요!</h3>
        <p className="text-sm text-amber-900/80 mb-6 font-semibold">
          동영상(MP4)을 굽기 위해서는<br />우리아이의 예쁜 자켓 사진이 꼭 필요합니다.
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={onUploadClick} className="w-full bg-gradient-to-r from-amber-400 to-pink-400 text-amber-950 font-black py-3 rounded-2xl shadow-md text-sm">
            사진 등록하기
          </button>
          <button onClick={onClose} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-2xl text-sm">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};


// === 🔒 [새로 추가] FirebaseUI 로그인 모달 컴포넌트 ===
export const LoginModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    // 브라우저 환경에 Firebase 및 FirebaseUI 스크립트가 로드되었는지 확인하고 구동합니다.
    const interval = setInterval(() => {
      if (window.firebase && window.firebaseui) {
        clearInterval(interval);
        
        // 이미 생성된 인스턴스가 있으면 가져오고, 없으면 새로 만듭니다.
        let ui = window.firebaseui.auth.AuthUI.getInstance();
        if (!ui) {
          ui = new window.firebaseui.auth.AuthUI(window.firebase.auth());
        }

        ui.start('#firebaseui-auth-container', {
          signInOptions: [
            window.firebase.auth.EmailAuthProvider.PROVIDER_ID,
            window.firebase.auth.GoogleAuthProvider.PROVIDER_ID
          ],
          callbacks: {
            signInSuccessWithAuthResult: function (authResult) {
              authResult.user.getIdToken().then(function (idToken) {
                // 노드 백엔드 서버로 구글 인증 토큰 전달
                fetch(`${BACKEND_URL}/api/login`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + idToken
                  }
                })
                .then(res => res.json())
                .then(resData => {
                  if (resData.success) {
                    alert(`반갑습니다! 보유 크레딧: ${resData.data.credits}개 🎁`);
                    onClose();
                    window.location.reload();
                  }
                })
                .catch(err => alert("서버 연동 실패: " + err));
              });
              return false;
            }
          },
          credentialHelper: window.firebaseui.auth.CredentialHelper.NONE
        });
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* 바깥 배경 흐리게 */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* 📦 흰색 모달 팝업 박스 */}
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-amber-100 animate-fadeIn text-center z-10">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg">✕</button>
        <h3 className="text-xl font-black text-amber-950 mb-1">반려동물 생일송 메이커</h3>
        <p className="text-xs text-amber-800/80 mb-6 font-bold">간편하게 가입하고 보상 크레딧을 받으세요!</p>
        
        {/* 🎯 이 빈 그릇 상자가 먼저 태어난 후, 위의 setTimeout이 작동하여 구글 양식을 여기에 주입합니다 */}
        <div id="firebaseui-auth-container" className="min-h-[160px] w-full text-left"></div>
      </div>
    </div>
  );
};

// === 전역 데이터: 탄생화 데이터베이스 ===
const rawFlowerData = {
  1: {
    1: { name: '스노드롭', language: '희망' }, 2: { name: '노란 수선화', language: '사랑에 답하여' }, 3: { name: '사프란', language: '후회 없는 청춘' }, 4: { name: '히아신스', language: '차분한 사랑' }, 5: { name: '노루귀', language: '인내' }, 6: { name: '흰제비꽃', language: '순진무구한 사랑' }, 7: { name: '튤립', language: '실연' }, 8: { name: '보라색 제비꽃', language: '사랑' }, 9: { name: '시클라멘', language: '수줍은 수줍음' }, 10: { name: '회상', language: '인내' }, 11: { name: '측백나무', language: '견고한 우정' }, 12: { name: '향기림', language: '사랑의 속삭임' }, 13: { name: '수선화', language: '신비' }, 14: { name: '시클라멘', language: '수줍은 성격' }, 15: { name: '가시나무', language: '엄격함' }, 16: { name: '노란 히아신스', language: '승부욕' }, 17: { name: '종포', language: '인내와 투지' }, 18: { name: '어리연꽃', language: '순결' }, 19: { name: '소나무', language: '불로장생' }, 20: { name: '미나리아재비', language: '천진난만' }, 21: { name: '담쟁이덩굴', language: '우정' }, 22: { name: '이끼', language: '모성애' }, 23: { name: '불로초', language: '영원한 건강' }, 24: { name: '가을 가막살나무', language: '사랑의 열정' }, 25: { name: '점나도나물', language: '순수함' }, 26: { name: '미모사', language: '섬세함' }, 27: { name: '마가목', language: '게으름을 모르는 마음' }, 28: { name: '검은 포플라', language: '용기' }, 29: { name: '이끼장미', language: '숭고한 사랑' }, 30: { name: '매쉬메리골드', language: '반드시 올 행복' }, 31: { name: '노란 사프란', language: '청춘의 기쁨' }
  },
  2: {
    1: { name: '앵초', language: '젊은 시절의 고뇌' }, 2: { name: '모과', language: '평범함' }, 3: { name: '황새냉이', language: '그대에게 바친다' }, 4: { name: '빨간 양귀비', language: '위로' }, 5: { name: '양치식물', language: '사랑스러움' }, 6: { name: '바위솔', language: '가정에 충실함' }, 7: { name: '물망초', language: '나를 잊지 말아요' }, 8: { name: '범의귀', language: '절실한 사랑' }, 9: { name: '은매화', language: '사랑의 속삭임' }, 10: { name: '서향', language: '영광' }, 11: { name: '멜리사', language: '동정심' }, 12: { name: '쥐꼬리망초', language: '수줍음' }, 13: { name: '갈풀', language: '끈기' }, 14: { name: '카모마일', language: '역경에 굴하지 않는 강인함' }, 15: { name: '삼나무', language: '웅대함' }, 16: { name: '월령화', language: '신비로운 매력' }, 17: { name: '야생화', language: '친근한 매력' }, 18: { name: '미나리아재비', language: '천진난만함' }, 19: { name: '떡갈나무', language: '붙임성이 좋음' }, 20: { name: '칼미아', language: '커다란 희망' }, 21: { name: '네모필라', language: '애국심' }, 22: { name: '무궁화', language: '일편단심 선율' }, 23: { name: '살구꽃', language: '아가씨의 수줍음' }, 24: { name: '빙카', language: '즐거운 추억' }, 25: { name: '사스레피나무', language: '흔들리지 않는 마음' }, 26: { name: '영춘화', language: '희망과 행복' }, 27: { name: '아라비아의 무궁화', language: '온화함' }, 28: { name: '보리수', language: '부부의 사랑' }, 29: { name: '아르메리아', language: '동정심과 배려' }
  },
  3: {
    1: { name: '수선화', language: '자존심과 영광' }, 2: { name: '미나리아재비', language: '아름다운 인격' }, 3: { name: '자운영', language: '나의 감동을 전한다' }, 4: { name: '나무딸기', language: '따뜻한 사랑' }, 5: { name: '수레국화', language: '미와 행복' }, 6: { name: '데이지', language: '명랑하고 쾌활한 성격' }, 7: { name: '정조화', language: '고상한 기품' }, 8: { name: '밤꽃', language: '진심 어린 격려' }, 9: { name: '낙엽송', language: '대담함' }, 10: { name: '느릅나무', language: '위엄과 신뢰' }, 11: { name: '씀바귀', language: '순박한 마음' }, 12: { name: '수양버들', language: '사랑의 슬픔' }, 13: { name: '산옥잠화', language: '사랑의 망각' }, 14: { name: '아몬드', language: '진실한 희망' }, 15: { name: '독미나리', language: '죽음도 두렵지 않은 사랑' }, 16: { name: '박하', language: '다시 한번 사랑하고 싶다' }, 17: { name: '콩꽃', language: '반드시 올 행복' }, 18: { name: '아스파라거스', language: '무변화의 강인함' }, 19: { name: '치자나무', language: '한없는 기쁨' }, 20: { name: '보라색 튤립', language: '영원한 사랑' }, 21: { name: '벚꽃', language: '정신적인 아름다움' }, 22: { name: '당아욱', language: '은혜와 온화함' }, 23: { name: '글라디올러스', language: '열정적인 사랑' }, 24: { name: '금영화', language: '희망찬 내일' }, 25: { name: '식물성 활명초', language: '개척 정신' }, 26: { name: '흰앵초', language: '첫사랑의 설렘' }, 27: { name: '칼세올라리아', language: '그대에게 바치는 사랑' }, 28: { name: '꽃아카시아나무', language: '우아함과 품격' }, 29: { name: '우엉', language: '괴롭히지 말아요' }, 30: { name: '금작화', language: '청초한 매력' }, 31: { name: '흑종초', language: '꿈속의 사랑' }
  },
  4: {
    1: { name: '아몬드', language: '진실한 사랑의 열망' }, 2: { name: '아네모네', language: '기대와 희망' }, 3: { name: '나팔수선화', language: '존경' }, 4: { name: '빨간 아네모네', language: '그대를 사랑해' }, 5: { name: '무화과', language: '풍요와 번영' }, 6: { name: '아도니스', language: '실난 나날의 추억' }, 7: { name: '공조팝나무', language: '노련함' }, 8: { name: '금작화', language: '박애와 헌신' }, 9: { name: '벚꽃나무', language: '단아한 매력' }, 10: { name: '빙카', language: '기쁜 젊은 날의 추억' }, 11: { name: '꽃고비', language: '화해' }, 12: { name: '복사꽃', language: '사랑의 포로' }, 13: { name: '페르시아 국화', language: '경쟁심' }, 14: { name: '흰나팔꽃', language: '넘치는 기쁨' }, 15: { name: '갈퀴나물', language: '기분 좋은 추억' }, 16: { name: '튤립', language: '아름다운 눈동자' }, 17: { name: '독일 창포', language: '멋진 결혼생활' }, 18: { name: '자운영', language: '감동적인 순간' }, 19: { name: '참제비고깔', language: '청명한 가을 하늘' }, 20: { name: '배나무꽃', language: '온화한 애정' }, 21: { name: '수양버들', language: '내 가슴의 슬픔' }, 22: { name: '과꽃', language: '믿음직한 사랑' }, 23: { name: '도라지', language: '상냥하고 따뜻함' }, 24: { name: '제라늄', language: '결심과 결의' }, 25: { name: '설강화', language: '희망찬 앞날' }, 26: { name: '논냉이', language: '불타는 애정' }, 27: { name: '수련', language: '청순한 마음' }, 28: { name: '빨간 앵초', language: '비할 바 없는 아름다움' }, 29: { name: '동백나무', language: '매력적인 사랑' }, 30: { name: '금사슬나무', language: '슬픈 아름다움' }
  },
  5: {
    1: { name: '카우슬립 앵초', language: '젊은 날의 슬픔' }, 2: { name: '미나리아재비', language: '기쁨의 소식' }, 3: { name: '민들레', language: '신탁과 사랑의 예언' }, 4: { name: '딸기꽃', language: '존중과 존경' }, 5: { name: '은방울꽃', language: '틀림없이 행복해집니다' }, 6: { name: '비단향꽃무', language: '영원한 아름다움' }, 7: { name: '딸기', language: '사랑과 존경' }, 8: { name: '수련', language: '청순무구한 영혼' }, 9: { name: '겹벚꽃', language: '정숙과 단아함' }, 10: { name: '꽃창포', language: '우아한 마음' }, 11: { name: '사과꽃', language: '유혹과 선망' }, 12: { name: '라일락', language: '사랑의 싹이 트다' }, 13: { name: '산사나무', language: '유일한 희망' }, 14: { name: '매발톱꽃', language: '우려와 감절함' }, 15: { name: '물망초', language: '진실한 사랑' }, 16: { name: '조팝나물', language: '노련한 사랑' }, 17: { name: '노란 튤립', language: '사랑의 표시' }, 18: { name: '옥스아이 데이지', language: '신의와 인내' }, 19: { name: '아리스타타', language: '아름다움의 절정' }, 20: { name: '괭이밥', language: '빛나는 마음' }, 21: { name: '담쟁이덩굴', language: '우정의 상징' }, 22: { name: '귀고리꽃', language: '열렬한 애정' }, 23: { name: '풀잎', language: '인내와 끈기' }, 24: { name: '헬리오토로프', language: '헌신적인 사랑' }, 25: { name: '삼색제비꽃', language: '나를 생각해 주세요' }, 26: { name: '올리브나무', language: '평화의 메신저' }, 27: { name: '데이지', language: '순수한 마음' }, 28: { name: '박하', language: '미덕과 따뜻한 품성' }, 29: { name: '토끼풀', language: '쾌활한 약속' }, 30: { name: '보라색 라일락', language: '사랑의 첫 새싹' }, 31: { name: '무릇', language: '강한 인내심' }
  },
  6: {
    1: { name: '연분홍 장미', language: '나의 마음 그대만이 아네' }, 2: { name: '매매화', language: '평온한 우정' }, 3: { name: '아마', language: '감사' }, 4: { name: '다마스크 장미', language: '빛나는 눈동자' }, 5: { name: '메리골드', language: '이별의 슬픔과 간절함' }, 6: { name: '노란 붓꽃', language: '믿는 자의 행복' }, 7: { name: '슈미트티아나', language: '사모하는 마음' }, 8: { name: '재스민', language: '사랑스러움과 매혹' }, 9: { name: '스위트피', language: '우아한 기쁨' }, 10: { name: '수염패랭이꽃', language: '의협심' }, 11: { name: '중국패랭이꽃', language: '사랑의 거절' }, 12: { name: '레제다 오도라타', language: '매력과 우아함' }, 13: { name: '타이거 릴리', language: '나를 사랑해 주세요' }, 14: { name: '뚜껑별꽃', language: '추상적인 매력' }, 15: { name: '카네이션', language: '끊임없는 열정' }, 16: { name: '튜베로즈', language: '위험한 쾌락' }, 17: { name: '토끼풀', language: '감화와 행복' }, 18: { name: '백선', language: '지조와 강인함' }, 19: { name: '장미', language: '사랑과 낭만' }, 20: { name: '꼬리풀', language: '달성된 사랑' }, 21: { name: '개양귀비', language: '약한 위안' }, 22: { name: '가막살나무', language: '사랑의 기쁨' }, 23: { name: '접시꽃', language: '열렬한 사랑' }, 24: { name: '벌노랑이', language: '신비로운 매력' }, 25: { name: '나팔꽃', language: '덧없는 사랑' }, 26: { name: '흰 장미', language: '순결과 존경' }, 27: { name: '시계꽃', language: '성스러운 사랑' }, 28: { name: ' 제라늄', language: '그대가 있어 행복합니다' }, 29: { name: '빨간 제라늄', language: '그대를 사랑하는 마음' }, 30: { name: '인동', language: '사랑의 인연' }
  },
  7: {
    1: { name: '단양쑥부쟁이', language: '태만' }, 2: { name: '금어초', language: '소망과 욕망' }, 3: { name: '흰색 양귀비', language: '망각' }, 4: { name: '자목련', language: '자연애' }, 5: { name: '라벤더', language: '풍부한 향기와 기쁨' }, 6: { name: '해바라기', language: '그리움과 숭배' }, 7: { name: '서양까치밥나무', language: '예상 밖의 큰 즐거움' }, 8: { name: '버드푸트', language: '영원한 사랑' }, 9: { name: '아이비 제라늄', language: '진실한 우정' }, 10: { name: '초롱꽃', language: '감사' }, 11: { name: '아스포델', language: '나는 그대의 것' }, 12: { name: '좁쌀풀', language: '포근한 위안' }, 13: { name: '꽃제라늄', language: '결심과 의지' }, 14: { name: '플록스', language: '온화한 기품' }, 15: { name: '들장미', language: '시인들의 사랑' }, 16: { name: '비단향꽃무', language: '영원한 매력' }, 17: { name: '흰색 장미', language: '존경과 순결' }, 18: { name: '이끼장미', language: '사랑의 속삭임' }, 19: { name: '백일홍', language: '떠나간 친구에 대한 그리움' }, 20: { name: '가지꽃', language: '진실한 진심' }, 21: { name: '노란 장미', language: '질투' }, 22: { name: '패랭이꽃', language: '순결한 사랑' }, 23: { name: '장미', language: '불타는 열정' }, 24: { name: '연꽃', language: '순결과 신성함' }, 25: { name: '말오줌나무', language: '치유와 위로' }, 26: { name: '향쑥', language: '평화와 평온' }, 27: { name: '제라늄', language: '진실한 애정' }, 28: { name: '패랭이꽃', language: '언제나 사랑해' }, 29: { name: '선인장', language: '불타는 마음' }, 30: { name: '서양종 보리수', language: '부부애' }, 31: { name: '호박꽃', language: '광대함' }
  },
  8: {
    1: { name: '빨간 빨강 양귀비', language: '위로와 위안' }, 2: { name: '수레국화', language: '행복의 연속' }, 3: { name: '수박풀', language: '아가씨의 아름다운 자태' }, 4: { name: '옥수수', language: '풍요와 재물' }, 5: { name: '엘리카', language: '고독' }, 6: { name: '능소화', language: '명예와 영광' }, 7: { name: '석류나무', language: '원숙한 아름다움' }, 8: { name: '진수목', language: '정직' }, 9: { name: '시스투스', language: '인기' }, 10: { name: '이끼장미', language: '가련한 매력' }, 11: { name: '빨간무늬제라늄', language: '위안과 평온' }, 12: { name: '협죽도', language: '위험한 사랑' }, 13: { name: '골든로드', language: '경계와 격려' }, 14: { name: '壁오동', language: '사모의 불꽃' }, 15: { name: '해바라기', language: '일편단심 선율' }, 16: { name: '타마린드', language: '지혜' }, 17: { name: '나무향기림', language: '부드러운 애정' }, 18: { name: '접시꽃', language: '열렬한 사랑' }, 19: { name: '로사 캠피온', language: '성실한 성품' }, 20: { name: '프리지아', language: '순결과 청초함' }, 21: { name: '짚신나물', language: '감사하는 마음' }, 22: { name: '스피리아', language: '노련한 노력' }, 23: { name: '서양종 보리수', language: '부부의 애정' }, 24: { name: '금잔화', language: '이별의 슬픔' }, 25: { name: '안스륨', language: '사랑에 타오르는 마음' }, 26: { name: '하이포시스 오리어', language: '빛을 찾다' }, 27: { name: '고비', language: '몽상' }, 28: { name: 'Eringium', language: '비밀스런 사랑' }, 29: { name: '꽃담배', language: '그대가 있어 외롭지 않네' }, 30: { name: '플록스', language: '온화하고 따뜻한 영혼' }, 31: { name: '토끼풀', language: '약속된 축복' }
  },
  9: {
    1: { name: '호랑이꽃', language: '나를 사랑해 주세요' }, 2: { name: '버섯', language: '상상력' }, 3: { name: '마거리트', language: '마음속 숨겨진 사랑' }, 4: { name: '지충이', language: '사랑의 포로' }, 5: { name: '느릅나무', language: '신뢰' }, 6: { name: '한련화', language: '애국심과 헌신' }, 7: { name: '오렌지나무', language: '새 신부의 기쁨' }, 8: { name: '갓꽃', language: '무심함' }, 9: { name: '갓', language: '무관심' }, 10: { name: '흰색 과꽃', language: '믿는 마음' }, 11: { name: '알로에', language: '꽃은 필 때까지 기다림' }, 12: { name: '클레마티스', language: '고결하고 순수한 마음' }, 13: { name: '버드나무', language: '솔직함과 온화함' }, 14: { name: '마르멜로', language: '유혹에 흔들리지 않는 마음' }, 15: { name: '다행화', language: '행복한 삶의 지속' }, 16: { name: '용담', language: '슬픈 그대마저 사랑해' }, 17: { name: '에리카', language: '고독과 외로움의 이겨냄' }, 18: { name: '엉겅퀴', language: '건드리지 마세요' }, 19: { name: '사초', language: '자중' }, 20: { name: '로즈메리', language: '나를 기억해 주세요' }, 21: { name: '사프란', language: '후회 없는 젊은 날' }, 22: { name: '퀘이킹 그라스', language: '흥분과 신선함' }, 23: { name: '주목', language: '고결한 인내' }, 24: { name: '오렌지', language: '풍요와 사랑스러움' }, 25: { name: '메귀리', language: '음악을 사랑하는 마음' }, 26: { name: '감나무', language: '자연미와 품격' }, 27: { name: '떡갈나무', language: '사랑은 영원히' }, 28: { name: '색비름', language: '애정' }, 29: { name: '사과', language: '유혹과 선망' }, 30: { name: '허브', language: '치유와 평온함' }
  },
  10: {
    1: { name: '빨간 국화', language: '사랑의 기쁨' }, 2: { name: '살구', language: '아가씨의 수줍음' }, 3: { name: '단풍나무', language: '자제와 배려' }, 4: { name: '홉', language: '성실함' }, 5: { name: '종려나무', language: '승리와 영광' }, 6: { name: '개암나무', language: '화해와 조화' }, 7: { name: '전나무', language: '고상한 기품' }, 8: { name: '파슬리', language: '승리와 감사' }, 9: { name: '희향', language: '극찬과 극복' }, 10: { name: '멜론', language: '풍요와 원만한 성품' }, 11: { name: '부처꽃', language: '사랑의 슬픔' }, 12: { name: '월귤', language: '반항심과 투지' }, 13: { name: '조팝나무', language: '단정하고 노련함' }, 14: { name: '흰색 국화', language: '진실한 사랑의 탐색' }, 15: { name: '스위트 바질', language: '좋은 희망' }, 16: { name: '이끼장미', language: '천진난만함' }, 17: { name: '포도', language: '풍요와 기쁨' }, 18: { name: '크랜베리', language: '슬픔을 극복하는 강인함' }, 19: { name: '빨간 봉선화', language: '날 건드리지 마세요' }, 20: { name: '마', language: '운명과 숙명' }, 21: { name: '엉겅퀴', language: '엄격함과 자존심' }, 22: { name: '코스모스', language: '소녀의 순정' }, 23: { name: '흰 제라늄', language: '그대가 있어 다행입니다' }, 24: { name: '매화', language: '고결한 품성' }, 25: { name: '단풍', language: '아름다운 노을빛 영혼' }, 26: { name: '수영', language: '애정의 표시' }, 27: { name: '들장미', language: '시인과 연인의 사랑' }, 28: { name: '무궁화', language: '은은하게 타오르는 일편단심' }, 29: { name: '해당화', language: '이끄는 사랑' }, 30: { name: '로벨리아', language: '양보와 배려' }, 31: { name: '칼라', language: '순결과 기품' }
  },
  11: {
    1: { name: '서양모과', language: '유일한 사랑' }, 2: { name: '루피너스', language: '모성애와 안심' }, 3: { name: '브리오니아', language: '타협과 조화' }, 4: { name: '멜라초', language: '비밀스러운 애정' }, 5: { name: '단양쑥부쟁이', language: '공훈과 업적' }, 6: { name: '등골나물', language: '주저와 망설임' }, 7: { name: '메리골드', language: '이별의 아픔과 절실함' }, 8: { name: '동자꽃', language: '기다림과 일편단심' }, 9: { name: '몰약꽃', language: '진실함' }, 10: { name: '부용', language: '섬세하고 영원한 미모' }, 11: { name: '흰동백', language: '비할 바 없는 비밀스런 매력' }, 12: { name: '레몬', language: '열정적인 사랑' }, 13: { name: '레몬 버베나', language: '끝없는 인내' }, 14: { name: '소나무', language: '불로장생과 곧은 마음' }, 15: { name: '황금싸리', language: '겸손함' }, 16: { name: '크리스마스 로즈', language: '추억을 안고 피어나다' }, 17: { name: '머위', language: '공평과 정의' }, 18: { name: '산나리', language: '장엄함과 숭고함' }, 19: { name: '범의귀', language: '비밀스런 열정' }, 20: { name: '뷰글라스', language: '진실' }, 21: { name: '초롱꽃', language: '정직과 성실한 기쁨' }, 22: { name: '매자나무', language: '까다로운 품격' }, 23: { name: '양치식물', language: '성실함의 연속' }, 24: { name: '가막살나무', language: '사랑의 기쁨' }, 25: { name: '개옻나무', language: '현명함' }, 26: { name: '서양톱풀', language: '전투와 극복의 열정' }, 27: { name: '붉은 칠엽수', language: '사치스러운 열정' }, 28: { name: '과꽃', language: '믿음직한 사랑의 신호' }, 29: { name: '바카리스', language: '개척자 정신' }, 30: { name: '낙엽송', language: '대담무쌍함' }
  },
  12: {
    1: { name: '국화', language: '사랑의 기쁨과 탐색' }, 2: { name: '이끼라벤더', language: '나에게 답해 주세요' }, 3: { name: '라벤더', language: '기대와 영광' }, 4: { name: '수영', language: '우정' }, 5: { name: '앰브로시아', language: '행복한 동행' }, 6: { name: '바위취', language: '절실한 사랑' }, 7: { name: '인동', language: '사랑의 인연' }, 8: { name: '갈대', language: '깊은 생각과 사색' }, 9: { name: '국화', language: '아름다운 진심' }, 10: { name: '동백나무', language: '겸손한 품위' }, 11: { name: '단양쑥부쟁이', language: '애국심' }, 12: { name: '목화', language: '우수와 포근한 애정' }, 13: { name: '자줏빛 국화', language: '사랑의 포로' }, 14: { name: '소나무', language: '용기와 장엄함' }, 15: { name: '서향', language: '영광의 순간' }, 16: { name: '오리나무', language: '장엄함' }, 17: { name: '벚꽃나무', language: '정신적인 순수미' }, 18: { name: '세이지', language: '구세와 가정의 덕' }, 19: { name: '백선', language: '열정과 지조' }, 20: { name: '파인애플', language: '완전무결함' }, 21: { name: '박하', language: '덕과 상냥함' }, 22: { name: '백일홍', language: '친구에 대한 영원한 행복' }, 23: { name: '플라타너스', language: '휴식และ 천재적인 지혜' }, 24: { name: '겨우살이', language: '강한 인내와 극복' }, 25: { name: '서양호랑가시나무', language: '선견지명과 행복' }, 26: { name: '겨우살이', language: '고귀하고 숭고함' }, 27: { name: '매화', language: '맑은 영혼' }, 28: { name: '석류', language: '성숙한 매력' }, 29: { name: '천남성', language: '신비롭고 쾌활함' }, 30: { name: '납매', language: '자애로움' }, 31: { name: '노송나무', language: '불멸의 깊은 사랑' }
  }
};

// === 전역 데이터: 맞춤 탄생석 데이터베이스 ===
const rawStoneData = {
  1: { name: '가넷 (석류석)', language: '진실한 우정과 영원한 충성' },
  2: { name: '자수정 (Amethyst)', language: '평화와 마음의 성실, 고귀함' },
  3: { name: '아쿠아마린 (남옥)', language: '영원한 젊음과 용기, 총명함' },
  4: { name: '다이아몬드 (금강석)', language: '영원한 사랑과 변치 않는 고귀함' },
  5: { name: '에메랄드 (취옥)', language: '행복과 행운, 부부의 변치 않는 애정' },
  6: { name: '진주 (Pearl)', language: '순결과 부귀, 건강과 영원한 아름다움' },
  7: { name: '루비 (홍옥)', language: '뜨거운 열정적인 사랑과 평화, 용기' },
  8: { name: '페리도트 (감람석)', language: '지혜와 부부의 행복, 친구와의 우정' },
  9: { name: '사파이어 (청옥)', language: '성실과 진실, 지혜와 변하지 않는 신념' },
  10: { name: '오발 (Opal/단백석)', language: '희망과 순결, 진실한 사랑과 행운' },
  11: { name: 'topaz (황옥)', language: '우정과 진실한 희망, 건강과 활력' },
  12: { name: '터키석 (Turquoise)', language: '성공과 승리, 번영과 안전한 여정' }
};

// === 전역 데이터: 음악 장르 목록 ===
const genreList = [
  { id: 'kpop', name: 'K-Pop', emoji: '🐕', desc: '신나는 댄스 비트' },
  { id: 'choir', name: '합창단', emoji: '🦎', desc: '웅장하고 파워풀한 느낌' },
  { id: 'acoustic', name: '어쿠스틱', emoji: '🐹', desc: '따뜻한 통기타 소리' },
  { id: 'trot', name: '트로트', emoji: '🐥', desc: '신명나는 흥겨운 축제' },
  { id: 'jazz', name: '재즈', emoji: '🎹', desc: '낭만 가득한 선율' },
  { id: 'citypop', name: '시티팝', emoji: '🌃', desc: '세련된 레트로 감성' }
];

export default function App() {
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'pet-birthday-maker';

  // --- 상태 관리 ---
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [genre, setGenre] = useState('kpop');
  const [sunoMode, setSunoMode] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 

  // 앨범 자켓 관련 상태
  const [jacketImage, setJacketImage] = useState(null);
  const [showJacketModal, setShowJacketModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); 
  const [showNoPhotoModal, setShowNoPhotoModal] = useState(false);
  
  // 🚪 모달창이 열려있는지(true) 닫혀있는지(false) 기억하는 스위치
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
// 🔑 [오타 교정 완료] 로그인 모달 열기 상태 변수 정규화
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 자켓 꾸미기(Decoration) 상태
  const [selectedFrame, setSelectedFrame] = useState('none'); 
  const [selectedSticker, setSelectedSticker] = useState('none'); 
  const [stickerX, setStickerX] = useState(50); 
  const [stickerY, setStickerY] = useState(25); 
  const [stickerSize, setStickerSize] = useState(60); 
  const [photoFilter, setPhotoFilter] = useState('none'); 
  const [customJacketText, setCustomJacketText] = useState(''); 

  // 제작 상태
  const [status, setStatus] = useState('idle'); 
  const [lyrics, setLyrics] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [limitError, setLimitError] = useState(null);

  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- AdMob 광고 관련 ---
  const getAdMobPlugin = () => {
    if (typeof window !== 'undefined' && window['Capacitor'] && window['Capacitor'].Plugins) {
      return window['Capacitor'].Plugins.AdMob;
    }
    return null;
  };

  const showRewardAd = async () => {
    const AdMob = getAdMobPlugin();
    if (!AdMob) {
      console.log("[AdMob] 웹 프리뷰 환경이므로 가상 보상형 광고를 로드합니다.");
      return true;
    }
    try {
      await AdMob.prepareRewardVideoAd({
        adId: 'ca-app-pub-3940256099942544/5224354917',
        isTesting: true
      });
      await AdMob.showRewardVideoAd();
      return true;
    } catch (e) {
      console.error("보상형 광고 로드 오류:", e);
      return true;
    }
  };

  const showInterstitialAd = async () => {
    const AdMob = getAdMobPlugin();
    if (!AdMob) {
      console.log("[AdMob] 웹 프리뷰 환경이므로 가상 전면 광고를 로드합니다.");
      return true;
    }
    try {
      await AdMob.prepareInterstitial({
        adId: 'ca-app-pub-3940256099942544/1033173712',
        isTesting: true
      });
      await AdMob.showInterstitial();
      return true;
    } catch (e) {
      console.error("전면 광고 로드 오류:", e);
      return true;
    }
  };

  // --- 날짜 포맷팅 함수 ---
  const formatBirthdate = (dateStr) => {
    if (!dateStr) return '년 / 월 / 일';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[0]}년 ${parts[1]}월 ${parts[2]}일`;
    }
    return dateStr;
  };

  // --- 탄생화 데이터 계산 ---
  const getFlowerDetails = (dateStr) => {
    if (!dateStr) return { flower: '기쁨의 꽃', language: '행복' };
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { flower: '기쁨의 꽃', language: '행복' };
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (rawFlowerData[month] && rawFlowerData[month][day]) {
      const data = rawFlowerData[month][day];
      return { flower: data.name, language: data.language };
    }
    return { flower: '사랑의 꽃', language: '영원한 축복' };
  };

  // --- 맞춤 탄생석 데이터 계산 ---
  const getStoneDetails = (dateStr) => {
    if (!dateStr) return { stone: '축복의 보석', language: '영원한 행운' };
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { stone: '축복의 보석', language: '영원한 행운' };
    const month = parseInt(parts[1], 10);

    if (rawStoneData[month]) {
      const data = rawStoneData[month];
      return { stone: data.name, language: data.language };
    }
    return { stone: '행복의 수호석', language: '건강과 평화' };
  };

  // --- 별자리 자동 계산 ---
  const getZodiacSign = (dateStr) => {
    if (!dateStr) return '별자리';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return '별자리';
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '양자리 ♈';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '황소자리 ♉';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '쌍둥이자리 ♊';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '게자리 Cancer ♋';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '사자자리 Leo ♌';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 23)) return '처녀자리 Virgo ♍';
    if ((month === 9 && day >= 24) || (month === 10 && day <= 22)) return '천칭자리 Libra ♎';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 22)) return '전갈자리 Scorpio ♏';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 24)) return '사수자리 Sagittarius ♐';
    if ((month === 12 && day >= 25) || (month === 1 && day <= 19)) return '염소자리 Capricorn ♑';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '물병자리 Aquarius ♒';
    return '물고기자리 Pisces ♓';
  };

  const flowerInfo = getFlowerDetails(birthdate);
  const stoneInfo = getStoneDetails(birthdate);
  const zodiacInfo = getZodiacSign(birthdate);

  // --- 카메라 제어 시스템 ---
  const startCamera = async (currentMode = facingMode) => {
    setShowJacketModal(false);
    setShowCamera(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentMode, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("카메라를 켤 수 없습니다:", err);
      setLimitError("카메라 장치 권한이 거부되었습니다.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;

      canvas.width = 500;
      canvas.height = 500;

      if (facingMode === 'user') {
        context.translate(500, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, startX, startY, size, size, 0, 0, 500, 500);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setJacketImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 500;
          canvas.height = 500;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setJacketImage(canvas.toDataURL('image/jpeg'));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
    setShowJacketModal(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleGenerate = async () => {
    if (!name.trim()) {
      setLimitError("우리아이 이름(반려동물 이름)을 입력해 주세요! 🐾");
      return;
    }
    if (!birthdate) {
      setLimitError("우리아이를 처음 만났거나 생일인 날짜를 선택해 주세요! 📅");
      return;
    }

    setStatus('generating_lyrics');
    await showRewardAd();

    setAudioUrl('');
    setLimitError(null);

    try {
      let finalLyrics = '';
      const selectedGenreName = genreList.find(g => g.id === genre)?.name || 'K-Pop';

      if (sunoMode) {
        setLyrics(`🎵 Suno AI가 가사와 멜로디를 한방에 자동 창작 중입니다...\n장르: ${selectedGenreName}\n주인공: ${name}\n\n(잠시 후 완성된 노래와 함께 진짜 가사가 이곳에 공개됩니다!)`);
        finalLyrics = `A cheerful, happy and moving ${selectedGenreName} song celebrating the birthday of a beloved pet named ${name}. Create beautiful Korean lyrics.`;
      } else {
        const lyricResponse = await fetch(`${BACKEND_URL}/api/generate-lyrics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name,
            zodiac: zodiacInfo,
            stone: stoneInfo.stone,
            flower: flowerInfo.flower,
            genre: selectedGenreName,
            isSunoAutoMode: false
          })
        });

        const lyricData = await lyricResponse.json();
        if (!lyricResponse.ok || lyricData.success === false) {
          throw new Error(lyricData.error || "작사 공장에 문제가 발생했습니다.");
        }

        finalLyrics = lyricData.lyrics;
        setLyrics(finalLyrics);
      }

      setStatus('generating_music');
      setIsLoading(true);

      const songResponse = await fetch(`${BACKEND_URL}/api/generate-song`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalLyrics,
          genre: selectedGenreName,
          title: name ? `${name} 생일송` : '우리아이 생일송',
          lyricMode: sunoMode ? 'suno' : 'custom',
          name: name
        })
      });

      const songData = await songResponse.json();
      if (!songResponse.ok || !songData.success) {
        throw new Error(songData.msg || "오디오 공장 구동에 실패했습니다.");
      }

      const activeTaskId = songData.taskId || (songData.data && songData.data.taskId);

      if (activeTaskId) {
        pollSongStatus(activeTaskId, sunoMode);
      } else {
        throw new Error("Suno Task ID를 발급받지 못했습니다.");
      }

    } catch (err) {
      console.error(err);
      setStatus('error');
      setLimitError(err.message || "생성 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  };

  const pollSongStatus = (taskId, isSunoMode) => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/song-status/${taskId}`);
        if (res.status !== 200) return;

        const resData = await res.json();
        let targetItem = resData.data || resData;

        const isCompleted = resData.status === 'SUCCESS' || resData.status === 'completed' || targetItem.audio_url || targetItem.audioUrl;

        if (isCompleted) {
          clearInterval(intervalId);
          const finalAudioUrl = targetItem.audio_url || targetItem.audioUrl || resData.audioUrl;
          setAudioUrl(finalAudioUrl);

          const realLyric = resData.lyric || resData.lyrics || resData.prompt || targetItem.lyric || targetItem.lyrics || targetItem.prompt;
          if (realLyric) setLyrics(realLyric);

          setStatus('completed');
          setIsLoading(false);
        } else if (resData.status === 'FAILED' || targetItem.status === 'failed') {
          clearInterval(intervalId);
          setStatus('error');
          setLimitError("오디오 추출 중 에러가 발생했습니다.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  };

  const handleDownload = async () => {
    if (!audioUrl) return;
    try {
      await showInterstitialAd();
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name || '우리아이'}_생일송.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setLimitError("다운로드 중 오류가 발생했습니다.");
    }
  };

  const handleReset = () => {
    setName(''); setBirthdate(''); setGenre('kpop'); setSunoMode(false);
    setJacketImage(null); setSelectedFrame('none'); setSelectedSticker('none');
    setPhotoFilter('none'); setCustomJacketText(''); setLyrics('');
    setAudioUrl(''); setStatus('idle');
  };

  const handleDownloadMP4 = async () => {
    if (!jacketImage) {
      setLimitError("영상에 들어갈 우리 아이의 예쁜 사진을 먼저 등록해 주세요! 📸");
      return;
    }
    if (!audioUrl) return;
    setStatus('video_encoding');

    try {
      await showInterstitialAd();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const size = 480;
      canvas.width = size;
      canvas.height = selectedFrame === 'polaroid' ? 600 : size;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      if (jacketImage && !jacketImage.startsWith('data:')) img.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = jacketImage;
      });

      let filterString = 'none';
      if (photoFilter === 'warm') filterString = 'sepia(0.35) saturate(1.3) contrast(1.05) brightness(1.02)';
      else if (photoFilter === 'cool') filterString = 'hue-rotate(15deg) saturate(1.15) brightness(1.05)';
      else if (photoFilter === 'vintage') filterString = 'sepia(0.55) contrast(0.9) brightness(0.88) grayscale(0.05)';
      else if (photoFilter === 'pastel') filterString = 'brightness(1.12) saturate(1.35) contrast(0.92)';
      ctx.filter = filterString;

      if (selectedFrame === 'retro-record') {
        ctx.save(); ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(img, 0, 0, size, size); ctx.restore(); ctx.filter = 'none';
        ctx.strokeStyle = '#171717'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2); ctx.stroke();
      } else if (selectedFrame === 'polaroid') {
        ctx.drawImage(img, 20, 20, size - 40, size - 40); ctx.filter = 'none';
      } else {
        ctx.drawImage(img, 0, 0, size, size); ctx.filter = 'none';
      }

      if (selectedFrame === 'confetti') {
        ctx.font = '24px sans-serif'; ctx.fillText('🎉', 30, 50); ctx.fillText('✨', size - 60, 60);
      } else if (selectedFrame === 'floral') {
        ctx.font = '22px sans-serif'; ctx.fillText('🌸', 15, 35); ctx.fillText('🌷', size - 45, 35);
      }

      if (selectedSticker !== 'none') {
        ctx.save();
        const pixelX = (stickerX / 100) * size;
        const pixelY = (stickerY / 100) * size;
        let stickerEmoji = '';
        if (selectedSticker === 'balloons') stickerEmoji = '🎈';
        else if (selectedSticker === 'candles') stickerEmoji = '🕯️';
        else if (selectedSticker === 'party-hat') stickerEmoji = '🥳';
        else if (selectedSticker === 'crown') stickerEmoji = '👑';

        ctx.font = `${stickerSize * 1.2}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(stickerEmoji, pixelX, pixelY);
        ctx.restore();
      }

      if (selectedFrame === 'polaroid') {
        ctx.fillStyle = '#374151'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
        ctx.fillText((customJacketText || `HAPPY BIRTHDAY ${name || 'BABY'}!`).toUpperCase(), size / 2, size + 40);
      }

      const flatJacketBase64 = canvas.toDataURL('image/jpeg', 0.85);

      const response = await fetch(`${BACKEND_URL}/api/generate-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: audioUrl, jacketImage: flatJacketBase64, name: name || 'pet_song' })
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) throw new Error("서버 비디오 생성 실패");

      if (window['Capacitor']) {
        window.open(resData.videoUrl, '_system');
      } else {
        const fileRes = await fetch(resData.videoUrl);
        const blob = await fileRes.blob();
        const videoUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = videoUrl;
        link.download = `${name || '우리아이'}생일송_비디오.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      setStatus('completed');
    } catch (err) {
      setStatus('error');
      setLimitError("비디오 생성 실패: " + err.message);
    }
  };

  const getFilterClass = () => {
    switch (photoFilter) {
      case 'warm': return 'sepia-[0.35] saturate-[1.3] contrast-[1.05] brightness-[1.02]';
      case 'cool': return 'hue-rotate-[15deg] saturate-[1.15] brightness-[1.05]';
      case 'vintage': return 'sepia-[0.55] contrast-[0.9] brightness-[0.88] grayscale-[0.05]';
      case 'pastel': return 'brightness-[1.12] saturate-[1.35] contrast-[0.92]';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-amber-50/60 flex flex-col items-center justify-start py-8 px-4 font-sans text-gray-800 pb-24 selection:bg-amber-200">
      
      {/* 🪟 [복귀완료] 크레딧 사용 안내 모달창 */}
      {isCreditModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#ffffff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ fontSize: '22px', fontWith: 'bold', marginBottom: '10px', color: '#333' }}>동영상 제작 확인</h2>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '25px' }}>
              영상 제작을 시작하시겠습니까?<br />
              <span style={{ color: '#FF5722', fontWeight: 'bold' }}>💎 5 크레딧</span>이 차감됩니다.
            </p>
            <button
              onClick={() => {
                setIsCreditModalOpen(false);
                handleDownloadMP4(); // 실제 MP4 굽기 함수 호출 연동
              }}
              style={{
                width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold',
                backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '12px'
              }}
            >
              확인 및 제작하기
            </button>
            <button
              onClick={() => alert("크레딧 충전 결제창 연동 공간입니다.")}
              style={{
                width: '100%', padding: '12px', fontSize: '16px', fontWeight: 'bold',
                backgroundColor: '#FFF3E0', color: '#FF9800', border: '1px solid #FFB74D', borderRadius: '8px', cursor: 'pointer', marginBottom: '15px'
              }}
            >
              ⚡ 크레딧 충전하기
            </button>
            <button onClick={() => setIsCreditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}>
              돌아가기
            </button>
          </div>
        </div>
      )}

      <PhotoRequiredModal
        isOpen={showNoPhotoModal}
        onClose={() => setShowNoPhotoModal(false)}
        onUploadClick={() => { setShowNoPhotoModal(false); setShowJacketModal(true); }}
      />

      <div className="w-full max-w-md bg-white border border-dashed border-amber-300 rounded-xl p-3 text-center text-xs text-amber-600/80 mb-6 shadow-sm">
        📢 [Google AdMob] 하단 배너 및 전면광고 가이드가 정상 탑재되었습니다
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100 flex flex-col relative">
        
       {/* ⚙️ 상단 우측 톱니모양 + 'MY' 일체형 버튼 */}
     <button 
          onClick={() => {
            setIsLoginModalOpen(true); 
          }}
          className="absolute top-5 right-5 z-30 flex items-center gap-1 bg-amber-950 text-white font-black px-3 py-1.5 rounded-full shadow-sm border border-amber-950 hover:bg-white hover:text-black hover:border-black active:scale-95 transition-all text-xs"
        >
        <span>⚙️</span>
        <span>MY</span>
      </button>

        <div className="bg-gradient-to-r from-amber-300 via-yellow-200 to-pink-200 p-6 text-center border-b border-amber-100 relative">
          <div className="absolute top-4 left-4 text-xl">🐾</div>
          <h1 className="text-2xl font-black text-amber-950 tracking-tight flex justify-center items-center gap-1.5 pr-14">
            우리아이 <span className="text-rose-500">생일송</span> 메이커
          </h1>
          <p className="text-xs text-amber-900/80 mt-1.5 font-medium pr-14">강아지, 고양이 사랑스러운 가족을 위한 특별한 음반</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2 text-center">
            <span className="text-xs font-bold text-amber-700 bg-amber-100/60 px-3 py-1 rounded-full uppercase tracking-wider">나만의 자켓 사진</span>
            <div className={`relative mx-auto mt-3 overflow-hidden shadow-lg border-4 border-white flex flex-col items-center justify-center transition-all duration-300
              ${selectedFrame === 'polaroid' ? 'bg-white p-4 pb-12 w-64 h-80 rounded-none shadow-2xl' : 'rounded-2xl w-56 h-56 bg-gradient-to-tr from-amber-100 to-pink-100'}`}
            >
              <div className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-amber-50 ${selectedFrame === 'retro-record' ? 'rounded-full border-8 border-neutral-900 shadow-inner' : ''}`}>
                {jacketImage ? (
                  <img src={jacketImage} alt="Album Jacket" className={`w-full h-full object-cover transition-all duration-300 ${getFilterClass()}`} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-amber-600/60 p-4">
                    <span className="text-5xl mb-2">💿</span>
                    <p className="text-xs font-bold">사랑스러운 사진을 등록해 주세요</p>
                  </div>
                )}

                {selectedFrame === 'confetti' && (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-pink-200/20">
                    <div className="absolute top-2 left-2 text-lg animate-bounce">🎉</div>
                    <div className="absolute top-4 right-3 text-sm animate-pulse">✨</div>
                    <div className="absolute bottom-3 left-4 text-sm animate-bounce">🎈</div>
                    <div className="absolute bottom-4 right-4 text-lg">🎊</div>
                  </div>
                )}

                {selectedFrame === 'floral' && (
                  <div className="absolute inset-0 pointer-events-none border-8 border-pink-100/60 flex items-center justify-center">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs bg-pink-100/90 text-pink-700 px-2 py-0.5 rounded-full font-bold">
                      🌸 {flowerInfo.flower} 리스
                    </div>
                    <div className="absolute top-1 left-1 text-xs">🌺</div>
                    <div className="absolute top-1 right-1 text-xs">🌷</div>
                    <div className="absolute bottom-1 left-1 text-xs">🌼</div>
                    <div className="absolute bottom-1 right-1 text-xs">🌹</div>
                  </div>
                )}

                {selectedSticker !== 'none' && (
                  <div className="absolute pointer-events-none transition-all duration-100 text-4xl" style={{ left: `${stickerX}%`, top: `${stickerY}%`, width: `${stickerSize}px`, height: `${stickerSize}px`, transform: 'translate(-50%, -50%)' }}>
                    {selectedSticker === 'balloons' && '🎈'}
                    {selectedSticker === 'candles' && '🕯️'}
                    {selectedSticker === 'party-hat' && '🥳'}
                    {selectedSticker === 'crown' && '👑'}
                  </div>
                )}
              </div>

              {selectedFrame === 'polaroid' && (
                <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                  <p className="font-bold text-gray-700 text-xs tracking-tight uppercase font-mono">{customJacketText || `🐾 HAPPY BIRTHDAY ${name || 'BABY'}!`}</p>
                  <p className="text-[9px] text-gray-400 font-bold tracking-widest mt-0.5">{birthdate ? formatBirthdate(birthdate) : 'YEAR/MONTH/DAY'}</p>
                </div>
              )}

              <button onClick={() => setShowJacketModal(true)} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200 z-20">
                <div className="bg-white/90 text-amber-950 px-4 py-2 rounded-full text-xs font-bold shadow-lg">📸 자켓 사진 변경</div>
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-3">
              <button onClick={() => setShowJacketModal(true)} className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-pink-400 text-amber-950 font-extrabold text-xs py-2.5 px-5 rounded-full shadow-md transform active:scale-95 transition-all">
                <span>📷</span> 사진 가져오기
              </button>
            </div>
          </div>

          <div className="bg-amber-100/30 border border-amber-200/60 rounded-2xl p-4 space-y-4">
            <h3 className="font-extrabold text-sm text-amber-950">🎨 자켓 꾸미기 스튜디오</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-900 block">1. 앨범 레이아웃 프레임</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[{ id: 'none', label: '기본' }, { id: 'polaroid', label: '폴라로이드' }, { id: 'confetti', label: '콘페티' }, { id: 'floral', label: '탄생화 리스' }].map((frame) => (
                  <button key={frame.id} onClick={() => setSelectedFrame(frame.id)} className={`py-2 px-1 rounded-xl text-[11px] font-black border ${selectedFrame === frame.id ? 'bg-amber-400 text-amber-950' : 'bg-white text-amber-800'}`}>{frame.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-900 block">2. 감성 이미지 필터</label>
              <div className="grid grid-cols-5 gap-1">
                {[{ id: 'none', label: '원본' }, { id: 'warm', label: '빈티지' }, { id: 'cool', label: '시원함' }, { id: 'pastel', label: '파스텔' }, { id: 'vintage', label: '흑백레트로' }].map((filter) => (
                  <button key={filter.id} onClick={() => setPhotoFilter(filter.id)} className={`py-1.5 rounded-lg text-[10px] font-bold border ${photoFilter === filter.id ? 'bg-amber-400 text-amber-950' : 'bg-white text-amber-700'}`}>{filter.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-dashed border-amber-200">
              <label className="text-xs font-bold text-amber-900 block">3. 생일 소품 스티커</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[{ id: 'none', label: '없음', emoji: '❌' }, { id: 'party-hat', label: '고깔모자', emoji: '🥳' }, { id: 'crown', label: '왕관', emoji: '👑' }, { id: 'balloons', label: '풍선', emoji: '🎈' }, { id: 'candles', label: '촛불', emoji: '🕯️' }].map((sticker) => (
                  <button key={sticker.id} onClick={() => setSelectedSticker(sticker.id)} className={`py-1.5 rounded-xl border flex flex-col items-center ${selectedSticker === sticker.id ? 'bg-rose-100 border-rose-300' : 'bg-white'}`}>
                    <span className="text-base">{sticker.emoji}</span>
                    <span className="text-[9px] font-bold mt-0.5">{sticker.label}</span>
                   </button>
                ))}
              </div>
            </div>
{/* 스티커 활성화 시 위치 조정기 등장 */}
              {selectedSticker !== 'none' && (
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/50 space-y-2 animate-fadeIn">
                  <div className="flex justify-between items-center text-[10px] font-bold text-amber-800 mb-1">
                    <span>💡 스티커 위치 및 크기 조절</span>
                    <span>가로: {stickerX}% / 세로: {stickerY}%</span>
                  </div>

                  {/* 조이패드 미세 위치 버튼 */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="grid grid-cols-3 gap-1 w-24">
                      <div></div>
                      <button
                        onClick={() => setStickerY(Math.max(0, stickerY - 2))}
                        className="bg-amber-100 active:bg-amber-200 text-amber-900 rounded-lg py-1 font-bold text-xs"
                      >
                        ▲
                      </button>
                      <div></div>
                      <button
                        onClick={() => setStickerX(Math.max(0, stickerX - 2))}
                        className="bg-amber-100 active:bg-amber-200 text-amber-900 rounded-lg py-1 font-bold text-xs"
                      >
                        ◀
                      </button>
                      <div className="bg-amber-200 rounded-lg flex items-center justify-center text-[9px] font-bold text-amber-900">
                        위치
                      </div>
                      <button
                        onClick={() => setStickerX(Math.min(100, stickerX + 2))}
                        className="bg-amber-100 active:bg-amber-200 text-amber-900 rounded-lg py-1 font-bold text-xs"
                      >
                        ▶
                      </button>
                      <div></div>
                      <button
                        onClick={() => setStickerY(Math.min(100, stickerY + 2))}
                        className="bg-amber-100 active:bg-amber-200 text-amber-900 rounded-lg py-1 font-bold text-xs"
                      >
                        ▼
                      </button>
                    </div>

                    {/* 크기 조절 슬라이더 */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] text-amber-950 font-bold">
                        <span>크기조정</span>
                        <span>{stickerSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="120"
                        value={stickerSize}
                        onChange={(e) => setStickerSize(parseInt(e.target.value, 10))}
                        className="w-full accent-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">우리 아이 이름 🐾</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="예) 초코, 나비, 해피" className="w-full px-4 py-3.5 bg-gray-50 border border-amber-200 rounded-2xl text-lg font-bold text-amber-950" />
            </div>
            <div>
              <label className="block text-sm font-bold text-amber-900 mb-1">처음 만난 날 또는 생일 📅</label>
              <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} className="w-full px-4 py-3.5 bg-gray-50 border border-amber-200 rounded-2xl text-lg font-bold text-amber-950 text-center" />
              <div className="mt-2 bg-pink-50/60 border border-pink-100 rounded-2xl p-3.5 text-center shadow-inner">
                <p className="text-xs text-pink-700/80 font-bold mb-1">선택된 날짜</p>
                <p className="text-base font-black text-rose-600 tracking-tight">{formatBirthdate(birthdate)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-amber-900">곡 스타일 선택 🎵</label>
            <div className="grid grid-cols-3 gap-2.5">
              {genreList.map((item) => (
                <button key={item.id} onClick={() => setGenre(item.id)} className={`flex flex-col items-center justify-center p-3 rounded-2xl border ${genre === item.id ? 'border-amber-400 bg-amber-100/50 ring-2 ring-amber-300' : 'border-amber-100 bg-white/70'}`}>
                  <span className="text-3xl mb-1">{item.emoji}</span>
                  <span className="text-sm font-black text-amber-950">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex bg-amber-100/50 rounded-lg p-1">
              <button type="button" onClick={() => !isLoading && setSunoMode(false)} className={`flex-1 py-2 text-center text-xs font-black ${!sunoMode ? 'text-amber-950' : 'text-amber-800/50'}`}>🌸 내 맞춤 가사</button>
              <button type="button" onClick={() => !isLoading && setSunoMode(true)} className={`flex-1 py-2 text-center text-xs font-black ${sunoMode ? 'text-amber-950' : 'text-amber-800/50'}`}>⚡ Suno 자동 가사</button>
            </div>

            <div className="pt-4">
              <button
                onClick={status === 'completed' ? handleReset : handleGenerate}
                disabled={status === 'generating_lyrics' || status === 'generating_music' || status === 'video_encoding'}
                className="w-full bg-gradient-to-r from-amber-400 via-rose-300 to-pink-400 text-amber-950 text-lg font-black py-4 rounded-2xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {status === 'generating_lyrics' && <span>⏳ Gemini 가사 작사 중...</span>}
                {status === 'generating_music' && <span>🎹 Suno AI 음원 작곡 중...</span>}
                {status === 'video_encoding' && <span>🎬 MP4 비디오 굽는 중...</span>}
                {status === 'completed' && <span>✨ 새로운 생일송 만들기</span>}
                {status !== 'generating_lyrics' && status !== 'generating_music' && status !== 'video_encoding' && status !== 'completed' && <span>🎉 나만의 생일송 만들기</span>}
              </button>
            </div>

            {status === 'completed' && (
              <div className="w-full mt-6 p-5 bg-white/60 rounded-2xl border border-rose-200">
                <h3 className="text-center font-black text-rose-500 mb-3 text-sm">🎵 가사 스냅샷</h3>
                <div className="text-center text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">{lyrics || "등록된 가사가 없습니다."}</div>
              </div>
            )}

            {audioUrl && (
              <div className="bg-pink-50/80 border border-pink-100 rounded-2xl p-4 space-y-3 shadow-md mt-4">
                <h3 className="font-extrabold text-pink-900 text-sm">🎵 완성된 음원 도착!</h3>
                <audio controls src={audioUrl} className="w-full"></audio>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button onClick={handleDownload} className="bg-amber-400 text-amber-950 font-black text-xs py-3 rounded-xl shadow-md">💾 MP3 다운로드</button>
                  <button
                    onClick={() => setIsCreditModalOpen(true)}
                    className="flex items-center justify-center gap-2 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all"
                    style={{ backgroundColor: '#4A90E2' }}
                  >
                    <span>MP4 비디오 제작</span>
                    <span style={{ backgroundColor: '#ffffff', color: '#4A90E2', padding: '1px 6px', borderRadius: '10px', fontSize: '10px' }}>💎 5</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === 앨범 사진 선택 모달 === */}
      {showJacketModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 space-y-4">
            <h3 className="text-center font-black text-amber-950">앨범 사진 등록하기</h3>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={triggerFileInput} className="p-6 bg-amber-50 rounded-2xl font-black text-amber-950 text-sm">🖼️ 갤러리 오픈</button>
              <button onClick={() => startCamera('user')} className="p-6 bg-rose-50 rounded-2xl font-black text-rose-950 text-sm">📸 실시간 촬영</button>
            </div>
            <button onClick={() => setShowJacketModal(false)} className="w-full bg-gray-100 py-3 rounded-2xl font-bold">취소</button>
          </div>
        </div>
      )}

      <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

      {/* === 실시간 카메라 모달 === */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4">
          <div className="w-full max-w-md bg-neutral-900 rounded-3xl overflow-hidden relative flex flex-col items-center">
            <video ref={videoRef} autoPlay playsInline className={`w-full aspect-square object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}></video>
            <div className="w-full p-6 bg-neutral-950 flex justify-between items-center px-12">
              <button type="button" onClick={toggleCameraFacing} className="text-white text-xl">🔄 반전</button>
              <button onClick={capturePhoto} className="w-16 h-16 bg-white rounded-full border-4 border-neutral-700"></button>
              <button onClick={stopCamera} className="text-white text-sm">닫기</button>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* === 에러 팝업 모달 === */}
      {limitError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center space-y-4 border">
            <h3 className="font-black text-amber-950">💡 확인 메시지</h3>
            <div className="text-sm text-amber-900/80 font-semibold">{React.isValidElement(limitError) ? limitError : String(limitError)}</div>
            <button onClick={() => setLimitError(null)} className="w-full bg-amber-400 py-3 rounded-2xl font-black text-sm">확인했습니다 🐾</button>
          </div>
        </div>
      )}
      {/* 🔒 [매우 중요 - 추가 완료] 화면상에 로그인 모달 레이아웃 팝업을 직접 호출하여 배치합니다 */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}

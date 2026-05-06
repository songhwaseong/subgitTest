import { Col, Form, Row } from "react-bootstrap";
import type { PagingInfo } from "../types/Paging";
import type { SearchCondition } from "../types/SearchCondition";

type Props = {
    searchCondition: SearchCondition;
    setSearchCondition: React.Dispatch<React.SetStateAction<SearchCondition>>;
    paging: PagingInfo;
};

function FieldSearch({ searchCondition, setSearchCondition, paging }: Props) {

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;

        setSearchCondition(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Form className="p-3">
            <Row className="mb-3" style={{ justifyContent: 'right' }}>
                {/* 페이지당 상품 수 */}
                <Col md={2}>
                    <Form.Select
                        name="pageSize"
                        className="text-center"
                        value={searchCondition.pageSize}
                        onChange={handleChange}
                    >
                        <option value="3">3개</option>
                        <option value="4">4개</option>
                        <option value="5">5개</option>
                        <option value="6">6개</option>
                        <option value="7">7개</option>
                        <option value="8">8개</option>
                        <option value="9">9개</option>
                        <option value="10">10개</option>
                        <option value="11">11개</option>
                        <option value="12">12개</option>
                    </Form.Select>
                </Col>
                {/* 상태 */}
                <Col md={2}>
                    <Form.Control
                        type="text"
                        className="text-center"
                        value={paging.pagingStatus}
                        disabled
                    />
                </Col>
            </Row>
            <Row className="mb-3">

                {/* 기간 */}
                <Col md={2}>
                    <Form.Select
                        name="searchDateType"
                        className="text-center"
                        value={searchCondition.searchDateType}
                        onChange={handleChange}
                    >
                        <option value='all'>전체 기간</option>
                        <option value='1d'>1일</option>
                        <option value='1w'>1주</option>
                        <option value='1m'>1개월</option>
                        <option value='6m'>6개월</option>
                    </Form.Select>
                </Col>

                {/* 카테고리 */}
                <Col md={2}>
                    <Form.Select
                        name="category"
                        className="text-center"
                        value={searchCondition.category}
                        onChange={handleChange}
                    >
                        <option value="ALL">카테고리</option>
                        <option value="BREAD">빵</option>
                        <option value="BEVERAGE">음료수</option>
                        <option value="CAKE">케익</option>
                        <option value="MACARON">마카롱</option>
                        <option value="CAT">고양이</option>
                    </Form.Select>
                </Col>

                {/* 검색 모드 */}
                <Col md={2}>
                    <Form.Select
                        name="searchMode"
                        className="text-center"
                        value={searchCondition.searchMode}
                        onChange={handleChange}
                    >
                        {/* <option value="ALL">전체 검색</option> */}
                        <option value="id">상품 ID</option>
                        <option value="name">상품명</option>
                        <option value="description">상품 설명</option>
                        <option value="priceMore">금액 이상</option>
                        <option value="priceLess">금액 이하</option>
                    </Form.Select>
                </Col>

                {/* 검색어 */}
                <Col md={4}>
                    <Form.Control
                        name="searchKeyword"
                        type="text"
                        placeholder="검색어를 입력해주세요"
                        value={searchCondition.searchKeyword}
                        onChange={handleChange}
                    />
                </Col>
                <Col md={2}>
                    <Form.Select
                        name="orderBy"
                        className="text-center"
                        value={searchCondition.orderBy}
                        onChange={handleChange}
                    >
                        <option value="Id">정렬(ByID)</option>
                        <option value="DescByPrice">금액 ↓</option>
                        <option value="AscByPrice">금액 ↑</option>
                        <option value="DescByName">상품명 ↓</option>
                        <option value="AscByName">상품명 ↑</option>
                        <option value="DescByDate">등록일 ↓</option>
                        <option value="AscByDate">등록일 ↑</option>
                    </Form.Select>
                </Col>

            </Row>
        </Form>
    );
}

export default FieldSearch;
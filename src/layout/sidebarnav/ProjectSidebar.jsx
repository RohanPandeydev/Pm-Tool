import React from 'react';
import { BiSolidBullseye, BiSolidCommentDetail } from 'react-icons/bi';
import { FaClipboardList } from 'react-icons/fa6';

export default function ProjectSidebar({ toggleStyle }) {

    return (
        <>
            <div className="dash-left-menu"
                style={{ display: toggleStyle ? "none" : "block" }}
            >
                <h3 className='lft-title mt-5'>Categories</h3>
                <div className='cate-bx'>
                    <ul>
                        <li><FaClipboardList /> Category 1</li>
                        <li><FaClipboardList /> Category 2</li>
                        <li><FaClipboardList /> Category 3</li>
                        <li><FaClipboardList /> Category 4</li>
                    </ul>
                </div>

                <h3 className='lft-title mt-5'>Add-ons</h3>
                <div className='cate-bx'>
                    <ul>
                        <li><BiSolidBullseye /> Web Visitor</li>
                    </ul>
                </div>

                <h3 className='lft-title mt-5'>Integrations</h3>
                <div className='cate-bx'>
                    <ul>
                        <li><BiSolidCommentDetail /> Messaging</li>
                    </ul>
                </div>
            </div>
        </>
    )
}
